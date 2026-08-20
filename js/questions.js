class QuestionManager{
  constructor(game){
    this.game=game;
    this.modal=document.getElementById('questionModal');
    this.title=document.getElementById('questionTitle');
    this.text=document.getElementById('questionText');
    this.answers=document.getElementById('answerList');
    this.feedback=document.getElementById('questionFeedback');
  }

  get(cell){
    return MAGIC5V_DATA.questions.find(q=>q.cell===cell)||null;
  }

  shuffled(question){
    const items=question.answers.map((text,index)=>({
      text,
      correct:index===question.correct
    }));

    for(let i=items.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [items[i],items[j]]=[items[j],items[i]];
    }

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

        btn.onclick=async()=>{
          const ok=option.correct;

          [...this.answers.children].forEach((button,index)=>{
            button.disabled=true;
            if(options[index].correct)button.classList.add('correct');
          });

          if(!ok)btn.classList.add('wrong');

          if(window.magicFX){
            magicFX.burstAtElement(btn,ok?'dice':'death',10);
          }

          if(ok){
            player.score++;
            this.feedback.textContent='✅ ¡Correcto! Sumas 1 punto.';
            this.game.updateScores();
            await this.game.wait(900);
            this.modal.classList.add('hidden');
            resolve(true);
            return;
          }

          player.skipTurns++;
          this.feedback.textContent='❌ Respuesta incorrecta.';
          this.game.updateScores();

          await this.game.wait(650);
          this.modal.classList.add('hidden');

          await this.game.showLoseTurn({
            icon:'🕳️',
            title:'¡Al pozo!',
            text:`${player.name} ha fallado la pregunta y cae al pozo. Pierde su próximo turno.`
          });

          resolve(false);
        };

        this.answers.appendChild(btn);
      });
    });
  }
}
