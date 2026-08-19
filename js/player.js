class Player{
  constructor(id){this.id=id;this.name=`Jugador ${id}`;this.position=1;this.score=0;this.skipTurns=0;this.element=null}
  create(){const el=document.createElement('div');el.className=`piece p${this.id}`;el.title=this.name;this.element=el;document.getElementById('piecesLayer').appendChild(el)}
}
