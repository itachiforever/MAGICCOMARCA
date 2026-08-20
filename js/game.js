class Game{
  constructor(){
    this.players=[];
    this.current=0;
    this.board=new Board();
    this.questions=new QuestionManager(this);
    this.locked=false;
    this.extraRoll=false;
    this.finished=false;
  }

  init(){
    document.getElementById('startBtn').onclick=()=>this.show('setupScreen');

    document.querySelectorAll('.player-select button').forEach(button=>{
      button.onclick=()=>this.start(Number(button.dataset.players));
    });

    document.getElementById('rollBtn').onclick=()=>this.roll();
    document.getElementById('restartBtn').onclick=()=>location.reload();
    document.getElementById('winRestartBtn').onclick=()=>location.reload();
  }

  show(id){
    document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  start(total){
    this.players=[];
    document.getElementById('piecesLayer').innerHTML='';

    for(let i=1;i<=total;i++){
      const player=new Player(i);
      player.create();
      this.players.push(player);
    }

    this.show('gameScreen');

    setTimeout(()=>{
      this.players.forEach(player=>this.board.place(player,true));
      this.updateUI();
      this.updateScores();
      this.log('Partida iniciada. Todos empiezan en casilla 1.');
    },120);
  }

  async roll(){
    if(this.locked||this.finished)return;

    const player=this.players[this.current];

    if(player.skipTurns>0){
      player.skipTurns--;

      await this.showLoseTurn({
        icon:'⏳',
        title:'Turno perdido',
        text:`${player.name} debe esperar este turno.`
      },1300);

      this.nextTurn();
      return;
    }

    this.locked=true;
    this.setStatus(`${player.name} tira el dado...`);

    const value=await this.rollDiceAnimation();
    const from=player.position;
    let target=from+value;

    if(target>50){
      target=50-(target-50);
      this.log(`${player.name}: dado ${value}. Rebota ${from} → ${target}.`);
    }else{
      this.log(`${player.name}: dado ${value}. ${from} → ${target}.`);
    }

    await this.board.moveStepByStep(player,target);

    if(window.magicFX)magicFX.landPuff(player.position,player.id);

    if(player.position===50){
      this.win(player);
      return;
    }

    await this.resolveLanding(player);

    if(this.extraRoll){
      this.extraRoll=false;
      this.locked=false;
      this.updateUI();
      return;
    }

    this.nextTurn();
  }

  async rollDiceAnimation(){
    const btn=document.getElementById('rollBtn');
    const face=document.getElementById('diceFace');
    const valueEl=document.getElementById('diceValue');
    const faces=['⚀','⚁','⚂','⚃','⚄','⚅'];

    btn.classList.remove('rolling','reveal');
    void btn.offsetWidth;
    btn.classList.add('rolling');
    face.textContent='🎲';
    valueEl.textContent='...';

    const sparks=setInterval(()=>{
      if(window.magicFX)magicFX.burstAtElement(btn,'dice',3);
    },170);

    await this.wait(1100);
    clearInterval(sparks);

    const value=Math.floor(Math.random()*6)+1;
    btn.classList.remove('rolling');
    btn.classList.add('reveal');
    setTimeout(()=>btn.classList.remove('reveal'),500);
    face.textContent=faces[value-1];
    valueEl.textContent=value;

    if(window.magicFX)magicFX.burstAtElement(btn,'dice',12);

    return value;
  }

  fx(cell,type){
    if(window.magicFX)magicFX.burstAtCell(cell,type);
  }

  async resolveLanding(player){
    const cell=player.position;
    const rules=MAGIC5V_DATA.rules;

    if(rules.death===cell){
      this.fx(cell,'death');
      this.setStatus('💀 Muerte: vuelves a la casilla 1.');
      this.log(`${player.name} cae en muerte y vuelve directo a la salida.`);
      await this.wait(650);
      await this.board.jumpTo(player,1);
      return;
    }

    if(rules.returnStart===cell){
      this.fx(cell,'start');
      this.setStatus('El Conde te envía a la salida.');
      this.log(`${player.name} cae en 44 y vuelve directo a la salida.`);
      await this.wait(650);
      await this.board.jumpTo(player,1);
      return;
    }

    if(rules.loseTurn.includes(cell)){
      this.fx(cell,'lose');
      player.skipTurns++;
      this.setStatus(`${player.name} pierde el siguiente turno.`);
      this.log(`${player.name} cae en casilla negra ${cell}.`);

      await this.showLoseTurn({
        icon:'⏳',
        title:'¡Pierdes un turno!',
        text:`${player.name} ha caído en la casilla ${cell} y pierde su próximo turno.`
      });

      return;
    }

    if(rules.diceCells[cell]){
      const to=rules.diceCells[cell];
      this.fx(cell,'dice');
      this.setStatus(`🎲 Dados: vas a la casilla ${to} y vuelves a tirar.`);
      this.log(`${player.name} cae en dados ${cell} → ${to}.`);
      await this.wait(650);
      await this.board.jumpTo(player,to);
      this.extraRoll=true;
      return;
    }

    if(rules.colorJumps[cell]){
      const to=rules.colorJumps[cell];
      this.fx(cell,'color');
      this.setStatus(`✨ Color: salto ${cell} → ${to}.`);
      this.log(`${player.name} cae en color ${cell} → ${to}.`);
      await this.wait(650);
      await this.board.jumpTo(player,to);
      return;
    }

    if(rules.logoCells.includes(cell)){
      const to=this.board.nextLogo(cell);

      if(to!==cell){
        this.fx(cell,'logo');
        this.setStatus(`🌀 Logo: avanzas hasta el siguiente logo (${to}) y vuelves a tirar.`);
        this.log(`${player.name} cae en logo ${cell} → ${to}.`);
        await this.wait(650);
        await this.board.jumpTo(player,to);

        if(player.position===50){
          this.win(player);
          return;
        }

        this.extraRoll=true;
        return;
      }
    }

    const question=this.questions.get(cell);

    if(question){
      this.setStatus(`${player.name} responde una pregunta.`);
      await this.questions.ask(player,question);
      return;
    }

    this.setStatus(`${player.name} se queda en la casilla ${cell}.`);
    await this.wait(350);
  }

  async showLoseTurn({icon='⏳',title='¡Pierdes un turno!',text='Pierdes tu próximo turno.'},duration=1700){
    const modal=document.getElementById('loseTurnModal');
    const iconEl=document.getElementById('loseTurnIcon');
    const titleEl=document.getElementById('loseTurnTitle');
    const textEl=document.getElementById('loseTurnText');

    if(!modal||!iconEl||!titleEl||!textEl)return;

    iconEl.textContent=icon;
    titleEl.textContent=title;
    textEl.textContent=text;
    modal.classList.remove('hidden');

    if(window.magicFX)magicFX.burstAtElement(iconEl,'death',14);

    await this.wait(duration);
    modal.classList.add('hidden');
  }

  nextTurn(){
    this.current=(this.current+1)%this.players.length;
    this.locked=false;
    this.updateUI();
  }

  updateUI(){
    const player=this.players[this.current];

    document.getElementById('turnText').innerHTML=`<span class="turn-chip p${player.id}"></span>${player.name}`;

    document.querySelectorAll('.piece').forEach(element=>element.classList.remove('active'));
    if(player.element)player.element.classList.add('active');

    this.setStatus(`Turno de ${player.name}.`);
    this.updateScores();
  }

  updateScores(){
    document.getElementById('scoreList').innerHTML=this.players.map(player=>
      `<div class="score-row"><span>${player.name}</span><b>${player.score} pt.</b></div>`
    ).join('');
  }

  setStatus(text){
    document.getElementById('statusText').textContent=text;
  }

  log(text){
    console.log(`[MAGIC5V] ${text}`);
  }

  win(player){
    this.finished=true;
    this.locked=true;

    if(window.magicFX)magicFX.starfall(3600);

    document.getElementById('winText').textContent=`${player.name} ha llegado a la casilla 50 con ${player.score} punto(s).`;
    document.getElementById('winModal').classList.remove('hidden');
    this.log(`🏆 ${player.name} gana la partida.`);
  }

  wait(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
  }
}
