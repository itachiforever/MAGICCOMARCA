// Sistema ligero de partículas para dar ambiente "cuento fantástico" al tablero.
class FX{
  constructor(container){
    this.container=container;
    this.canvas=document.createElement('canvas');
    this.canvas.className='fx-canvas';
    container.appendChild(this.canvas);
    this.ctx=this.canvas.getContext('2d');
    this.particles=[];
    this.resize();
    window.addEventListener('resize',()=>this.resize());
    this.last=performance.now();
    requestAnimationFrame(t=>this.loop(t));
  }
  resize(){
    const r=this.container.getBoundingClientRect();
    this.canvas.width=Math.max(1,r.width);
    this.canvas.height=Math.max(1,r.height);
  }
  burst(x,y,opts={}){
    const {colors=['#f7d575','#fff','#e8c566'],count=18,speed=2.4,life=650,size=3,gravity=0.02,spread=Math.PI*2,start=0}=opts;
    for(let i=0;i<count;i++){
      const angle=start+Math.random()*spread;
      const v=speed*(0.4+Math.random()*0.9);
      this.particles.push({
        x,y,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,
        life,age:0,size:size*(0.6+Math.random()*0.9),
        color:colors[Math.floor(Math.random()*colors.length)],
        gravity,spin:(Math.random()-0.5)*0.2,shape:opts.shape||'circle'
      });
    }
  }
  trail(x,y,color='#fff',size=2.4){
    this.particles.push({x,y,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4-0.25,life:420,age:0,size:size+Math.random()*1.6,color,gravity:0.006,shape:'circle'});
  }
  confetti(count=70){
    const colors=['#f7d575','#e84754','#2dbf9d','#377dff','#f2c744','#c9a6ff','#fff'];
    for(let i=0;i<count;i++){
      this.particles.push({
        x:Math.random()*this.canvas.width,
        y:-10-Math.random()*80,
        vx:(Math.random()-0.5)*1.6,
        vy:1+Math.random()*1.6,
        life:2200+Math.random()*900,age:0,
        size:3+Math.random()*3,
        color:colors[Math.floor(Math.random()*colors.length)],
        gravity:0.012,spin:(Math.random()-0.5)*0.3,shape:'rect',rot:Math.random()*Math.PI
      });
    }
  }
  loop(t){
    const dt=Math.min(32,t-this.last);this.last=t;
    const ctx=this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    if(this.particles.length){
      this.particles=this.particles.filter(p=>p.age<p.life);
      for(const p of this.particles){
        p.age+=dt;
        p.vy+=p.gravity;
        p.x+=p.vx;p.y+=p.vy;
        p.rot=(p.rot||0)+(p.spin||0);
        const a=Math.max(0,1-p.age/p.life);
        ctx.globalAlpha=a;
        ctx.fillStyle=p.color;
        if(p.shape==='rect'){
          ctx.save();
          ctx.translate(p.x,p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size/2,-p.size/2*0.6,p.size,p.size*0.6);
          ctx.restore();
        }else{
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
          ctx.fill();
        }
      }
      ctx.globalAlpha=1;
    }
    requestAnimationFrame(tt=>this.loop(tt));
  }
}
