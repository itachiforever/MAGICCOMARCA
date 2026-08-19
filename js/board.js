class Board{
  constructor(){
    this.img=document.getElementById('boardImage');
    this.labels=document.getElementById('labelsLayer');
    this.data=MAGIC5V_DATA;
    this.playerOffsets=[[0,-7],[8,0],[-8,0],[0,7]];
    this.stepDuration=260;
    this.lastTrail=0;
    this.players=[];
    this.center=this.data.cells[50];
    window.addEventListener('resize',()=>this.refreshPieces());
  }
  scale(){return{sx:this.img.clientWidth/this.data.imageWidth,sy:this.img.clientHeight/this.data.imageHeight}}
  scalePoint(cell){const [x,y]=this.data.cells[cell];const {sx,sy}=this.scale();return{x:x*sx,y:y*sy}}
  setTransition(el,seconds){el.style.transition=`transform .2s ease${seconds?`,left ${seconds}s linear,top ${seconds}s linear`:''}`}
  place(player,instant=false){const p=this.scalePoint(player.position);const off=this.playerOffsets[player.id-1]||[0,0];const el=player.element;if(!this.players.includes(player))this.players.push(player);if(instant){el.style.transition='none'}el.style.left=`${p.x+off[0]}px`;el.style.top=`${p.y+off[1]}px`;if(instant){requestAnimationFrame(()=>requestAnimationFrame(()=>this.setTransition(el,0)))}}
  refreshPieces(){this.players.forEach(p=>this.place(p,true))}

  // Punto de control de la curva: comba el trazo hacia afuera del centro de la
  // espiral, siguiendo el arco real del tablero en vez de cortar en línea recta.
  arcControl(cellA,cellB){
    const a=this.data.cells[cellA],b=this.data.cells[cellB];
    const [cx,cy]=this.center;
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    const rA=Math.hypot(a[0]-cx,a[1]-cy),rB=Math.hypot(b[0]-cx,b[1]-cy);
    const avgR=(rA+rB)/2;
    const dx=mx-cx,dy=my-cy;
    const len=Math.hypot(dx,dy)||1;
    const arcX=cx+(dx/len)*avgR,arcY=cy+(dy/len)*avgR;
    const bow=avgR?Math.max(0,1-Math.abs(rA-rB)/avgR):0;
    return[mx+(arcX-mx)*bow,my+(arcY-my)*bow];
  }
  easeInOut(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}

  async animateStep(player,fromCell,toCell){
    const el=player.element;
    const off=this.playerOffsets[player.id-1]||[0,0];
    const a=this.data.cells[fromCell],b=this.data.cells[toCell];
    const c=this.arcControl(fromCell,toCell);
    el.style.transition='none';
    const start=performance.now();
    const dur=this.stepDuration;
    await new Promise(resolve=>{
      const frame=now=>{
        const t=Math.min(1,(now-start)/dur);
        const e=this.easeInOut(t);
        const x=(1-e)*(1-e)*a[0]+2*(1-e)*e*c[0]+e*e*b[0];
        const y=(1-e)*(1-e)*a[1]+2*(1-e)*e*c[1]+e*e*b[1];
        const {sx,sy}=this.scale();
        el.style.left=`${x*sx+off[0]}px`;
        el.style.top=`${y*sy+off[1]}px`;
        if(window.magicFX&&now-this.lastTrail>50){this.lastTrail=now;magicFX.trail(x*sx+off[0],y*sy+off[1],player.id)}
        if(t<1){requestAnimationFrame(frame)}else{resolve()}
      };
      requestAnimationFrame(frame);
    });
  }
  async moveStepByStep(player,target){
    const dir=target>=player.position?1:-1;
    const el=player.element;
    el.classList.add('hop');
    while(player.position!==target){
      const from=player.position;
      const to=from+dir;
      await this.animateStep(player,from,to);
      player.position=to;
    }
    el.classList.remove('hop');
  }
  async jumpTo(player,target){const el=player.element;const from=player.position;el.classList.add('hop');await this.animateStep(player,from,target);player.position=target;el.classList.remove('hop')}
  wait(ms){return new Promise(r=>setTimeout(r,ms))}
  nextLogo(cell){const logos=this.data.rules.logoCells;const next=logos.find(v=>v>cell);return next||logos[0]}
  makeLabels(){this.labels.innerHTML='';for(let i=1;i<=50;i++){const p=this.scalePoint(i);const d=document.createElement('div');d.className='cell-label';d.textContent=i;d.style.left=`${p.x}px`;d.style.top=`${p.y}px`;this.labels.appendChild(d)}}
  toggleLabels(){this.makeLabels();this.labels.classList.toggle('hidden')}
}
