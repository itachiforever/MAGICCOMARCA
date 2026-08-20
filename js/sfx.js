// Pequeño motor de sonido sintetizado con Web Audio (sin necesitar archivos .mp3).
class SFX{
  constructor(){this.ctx=null;this.muted=false}
  ensure(){
    if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended')this.ctx.resume();
    return this.ctx;
  }
  tone(freq,dur=0.15,type='sine',gain=0.05,delay=0){
    if(this.muted)return;
    const ctx=this.ensure();
    const t0=ctx.currentTime+delay;
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,t0);
    g.gain.setValueAtTime(0,t0);
    g.gain.linearRampToValueAtTime(gain,t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);osc.stop(t0+dur+0.03);
  }
  chord(freqs,dur=0.3,type='sine',gain=0.04,stagger=0.02){freqs.forEach((f,i)=>this.tone(f,dur,type,gain,i*stagger))}
  diceRoll(){for(let i=0;i<6;i++)this.tone(160+Math.random()*260,0.05,'square',0.025,i*0.08)}
  step(){this.tone(500+Math.random()*90,0.07,'triangle',0.03)}
  sparkle(){this.chord([880,1320,1760],0.35,'sine',0.028)}
  magic(){this.chord([440,660,880,1320,1760],0.55,'sine',0.03,0.03)}
  portal(){this.chord([220,330,440,660],0.6,'sawtooth',0.02,0.04)}
  bad(){this.tone(170,0.4,'sawtooth',0.045);this.tone(110,0.5,'sawtooth',0.04,0.08)}
  fog(){this.tone(260,0.4,'sine',0.03);this.tone(200,0.5,'sine',0.025,0.1)}
  correct(){this.chord([523,659,784,1046],0.4,'triangle',0.04,0.05)}
  win(){[523,659,784,1046,1318].forEach((f,i)=>this.tone(f,0.45,'triangle',0.045,i*0.13))}
  toggleMute(){this.muted=!this.muted;return this.muted}
}
