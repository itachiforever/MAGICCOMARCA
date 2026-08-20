class Player {
  constructor(id, creatureId) {
    this.id = id;
    this.name = `Jugador ${id}`;
    this.creatureId = creatureId || 'dragon';
    this.position = 1;
    this.score = 0;
    this.skipTurns = 0;
    this.element = null;
    this.object3D = null;
  }
}
