class Effects{
  constructor(board){
    this.board=board;
    this.frame=document.getElementById('boardFrame');
    this.layer=document.createElement('div');
    this.layer.className='fx-layer';
    this.frame.appendChild(this.layer);
    this.ambientLayer=document.createElement('div');
    this.ambientLayer.className='fx-ambient';
    document.body.appendChild(this.ambientLayer);
    this.uiLayer=document.createElement('div');
    this.uiLayer.className='fx-ui';
    document.body.appendChild(this.uiLayer);
    this.trailColors={1:'#ff8d96',2:'#7df2d6',3:'#8db4ff',4:'#ffe08a'};
    this.palettes={
      logo:['#7de3ff','#b48dff','#e0f7ff'],
      color:['#ff8d96','#7df2d6','#ffe08a','#8db4ff'],
      dice:['#ffd86b','#fff3c4','#f0a63a'],
      death:['#9b6bff','#5a3a8a','#2e1b4d'],
      start:['#c9a2ff','#8d6bd6','#f0e2ff'],
      lose:['#8a8fa8','#4a4f66','#c7ccdd'],
      win:['#ffd86b','#7de3ff','#ff9ad5','#b48dff']
    };
    this.toastLayer=document.createElement('div');
    this.toastLayer.className='fx-toast-layer';
    document.body.appendChild(this.toastLayer);
    this.toastIcons={
      lose:'⏳',
      death:'💀',
      start:'🏰',
      win:'🏆',
      info:'✨'
    };
    this.startAmbient();
    this.startBoardAmbient();
    this.startPieceAura();
  }
  toast(type,title,message,duration=2600){
    const t=document.createElement('div');
    t.className=`fx-toast fx-toast-${type}`;
    const icon=this.toastIcons[type]||'✨';
    t.innerHTML=`<div class="fx-toast-icon">${icon}</div><div class="fx-toast-body"><strong>${title}</strong><span>${message}</span></div>`;
    this.toastLayer.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('show'));
    setTimeout(()=>{
      t.classList.remove('show');
      setTimeout(()=>t.remove(),500);
    },duration);
  }
  screenShake(){
    const frame=document.getElementById('boardFrame');
    if(!frame)return;
    frame.classList.remove('shake');
    void frame.offsetWidth;
    frame.classList.add('shake');
    setTimeout(()=>frame.classList.remove('shake'),520);
  }
  spawn(x,y,{cls='fx-spark',text='✦',color='#ffd86b',size=13,dx=0,dy=-30,dur=900,layer=this.layer}={}){
    const s=document.createElement('span');
    s.className=cls;
    s.textContent=text;
    s.style.left=`${x}px`;
    s.style.top=`${y}px`;
    s.style.color=color;
    s.style.fontSize=`${size}px`;
    s.style.setProperty('--dx',`${dx}px`);
    s.style.setProperty('--dy',`${dy}px`);
    s.style.animationDuration=`${dur}ms`;
    layer.appendChild(s);
    setTimeout(()=>s.remove(),dur+80);
    return s;
  }
  trail(x,y,playerId){
    const color=this.trailColors[playerId]||'#ffd86b';
    const chars=['✦','✧','·','✨'];
    this.spawn(x+(Math.random()*14-7),y+(Math.random()*14-7),{
      text:chars[Math.floor(Math.random()*chars.length)],
      color,
      size:9+Math.random()*8,
      dx:Math.random()*20-10,
      dy:-(14+Math.random()*22),
      dur:600+Math.random()*400
    });
  }
  burst(x,y,palette,count=16){
    const ring=document.createElement('span');
    ring.className='fx-ring';
    ring.style.left=`${x}px`;
    ring.style.top=`${y}px`;
    ring.style.borderColor=palette[0];
    this.layer.appendChild(ring);
    setTimeout(()=>ring.remove(),800);
    const chars=['✦','✧','✨','⋆'];
    for(let i=0;i<count;i++){
      const ang=(Math.PI*2*i)/count+Math.random()*0.5;
      const dist=30+Math.random()*40;
      this.spawn(x,y,{
        text:chars[Math.floor(Math.random()*chars.length)],
        color:palette[i%palette.length],
        size:10+Math.random()*10,
        dx:Math.cos(ang)*dist,
        dy:Math.sin(ang)*dist,
        dur:700+Math.random()*400
      });
    }
  }
  burstAtCell(cell,type){
    const p=this.board.scalePoint(cell);
    this.burst(p.x,p.y,this.palettes[type]||this.palettes.dice);
  }
  puff(x,y,palette,count=7,layer=this.layer){
    const chars=['✦','✧','·'];
    for(let i=0;i<count;i++){
      const ang=Math.random()*Math.PI*2;
      const dist=12+Math.random()*20;
      this.spawn(x,y,{
        text:chars[Math.floor(Math.random()*chars.length)],
        color:palette[i%palette.length],
        size:8+Math.random()*8,
        dx:Math.cos(ang)*dist,
        dy:Math.sin(ang)*dist-8,
        dur:500+Math.random()*350,
        layer
      });
    }
  }
  landPuff(cell,playerId){
    const p=this.board.scalePoint(cell);
    this.puff(p.x,p.y,[this.trailColors[playerId]||'#ffd86b','#fff3c4']);
  }
  burstAtElement(el,type,count=14){
    const r=el.getBoundingClientRect();
    const x=r.left+r.width/2,y=r.top+r.height/2;
    const palette=this.palettes[type]||this.palettes.dice;
    this.burst2(x,y,palette,count,this.uiLayer);
  }
  burst2(x,y,palette,count,layer){
    const ring=document.createElement('span');
    ring.className='fx-ring';
    ring.style.left=`${x}px`;
    ring.style.top=`${y}px`;
    ring.style.borderColor=palette[0];
    layer.appendChild(ring);
    setTimeout(()=>ring.remove(),800);
    const chars=['✦','✧','✨','⋆'];
    for(let i=0;i<count;i++){
      const ang=(Math.PI*2*i)/count+Math.random()*0.5;
      const dist=26+Math.random()*36;
      this.spawn(x,y,{
        text:chars[Math.floor(Math.random()*chars.length)],
        color:palette[i%palette.length],
        size:10+Math.random()*10,
        dx:Math.cos(ang)*dist,
        dy:Math.sin(ang)*dist,
        dur:650+Math.random()*400,
        layer
      });
    }
  }
  starfall(duration=2600){
    const layer=document.createElement('div');
    layer.className='fx-starfall';
    document.body.appendChild(layer);
    const chars=['✦','✧','✨','⋆','🌟'];
    const palette=this.palettes.win;
    const timer=setInterval(()=>{
      this.spawn(Math.random()*window.innerWidth,-20,{
        cls:'fx-fall',
        text:chars[Math.floor(Math.random()*chars.length)],
        color:palette[Math.floor(Math.random()*palette.length)],
        size:12+Math.random()*18,
        dur:1600+Math.random()*1400,
        layer
      });
    },70);
    setTimeout(()=>{clearInterval(timer);setTimeout(()=>layer.remove(),3200)},duration);
  }
  startBoardAmbient(){
    setInterval(()=>{
      if(!document.getElementById('gameScreen').classList.contains('active'))return;
      if(document.hidden)return;
      const w=this.board.img.clientWidth,h=this.board.img.clientHeight;
      if(!w||!h)return;
      this.spawn(Math.random()*w,h*(0.55+Math.random()*0.45),{
        cls:'fx-mote',
        text:Math.random()<0.3?'✧':'·',
        color:Math.random()<0.5?'#ffd86b':'#b48dff',
        size:10+Math.random()*10,
        dy:-(60+Math.random()*140),
        dx:Math.random()*50-25,
        dur:3200+Math.random()*2600
      });
    },300);
  }
  startPieceAura(){
    setInterval(()=>{
      if(document.hidden)return;
      const el=document.querySelector('.piece.active');
      if(!el)return;
      const x=parseFloat(el.style.left),y=parseFloat(el.style.top);
      if(Number.isNaN(x)||Number.isNaN(y))return;
      this.spawn(x+(Math.random()*20-10),y+(Math.random()*16-4),{
        text:Math.random()<0.5?'✧':'·',
        color:'#ffe9a8',
        size:8+Math.random()*6,
        dx:Math.random()*14-7,
        dy:-(12+Math.random()*16),
        dur:700+Math.random()*400
      });
    },380);
  }
  startAmbient(){
    setInterval(()=>{
      const gameActive=document.getElementById('gameScreen').classList.contains('active');
      const startActive=document.getElementById('startScreen').classList.contains('active');
      if(!gameActive&&!startActive)return;
      if(document.hidden)return;
      this.spawn(Math.random()*window.innerWidth,window.innerHeight+10,{
        cls:'fx-mote',
        text:'·',
        color:Math.random()<0.5?'#ffd86b':'#b48dff',
        size:14+Math.random()*14,
        dy:-(160+Math.random()*260),
        dx:Math.random()*80-40,
        dur:5000+Math.random()*4000,
        layer:this.ambientLayer
      });
    },420);
  }
}
