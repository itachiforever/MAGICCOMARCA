class QuestionManager{
  constructor(game){
    this.game=game;
    this.modal=document.getElementById('questionModal');
    this.title=document.getElementById('questionTitle');
    this.text=document.getElementById('questionText');
    this.answers=document.getElementById('answerList');
    this.feedback=document.getElementById('questionFeedback');
  }
  get(cell){return MAGIC5V_DATA.questions.find(q=>q.cell===cell)||null}
  shuffled(question){
    const items=question.answers.map((text,index)=>({text,correct:index===question.correct}));
    for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
    return items;
  }
  async ask(player,question){
    return new Promise(resolve=>{
      this.title.textContent=question.title;
      this.text.textContent=question.text;
      this.answers.innerHTML='';
      this.feedback.textContent='';
      this.modal.classList.remove('hidden');
      const options=this.shuffled(question);
      options.forEach(option=>{
        const btn=document.createElement('button');
        btn.className='answer-btn';
        btn.textContent=option.text;
        btn.onclick=()=>{
          const ok=option.correct;
          [...this.answers.children].forEach((b,idx)=>{b.disabled=true;if(options[idx].correct)b.classList.add('correct')});
          if(!ok)btn.classList.add('wrong');
          this.feedback.textContent=ok?'✅ Correcto. Sumas 1 punto.':'❌ Fallo. Pierdes el siguiente turno.';
          if(window.magicFX){magicFX.burstAtElement(btn,ok?'dice':'death',10);if(!ok){magicFX.toast('lose','Respuesta fallida',`${player.name} pierde el próximo turno.`);magicFX.screenShake()}}
          if(ok){player.score++}else{player.skipTurns++}
          this.game.updateScores();
          setTimeout(()=>{this.modal.classList.add('hidden');resolve(ok)},900);
        };
        this.answers.appendChild(btn);
      });
    });
  }
}
