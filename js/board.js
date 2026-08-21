class Board {
  constructor(scene3d) {
    this.scene3d = scene3d;
    this.data = MAGIC5V_DATA;
    this.fallback = scene3d.fallback;
    this.playerOffsets = [
      new THREE.Vector3(-0.18, 0, -0.12),
      new THREE.Vector3(0.18, 0, -0.12),
      new THREE.Vector3(-0.18, 0, 0.12),
      new THREE.Vector3(0.18, 0, 0.12),
    ];
    this.fallbackOffsets = [
      { x: -1.2, y: -0.8 },
      { x: 1.2, y: -0.8 },
      { x: -1.2, y: 0.8 },
      { x: 1.2, y: 0.8 },
    ];
    this.stepDuration = 260;
    this.lastTrail = 0;
    this.players = [];
    this.center = this.data.cells[50];
  }

  scalePoint(cell) {
    if (this.fallback) {
      const p = this.scene3d.cellToScreen(cell);
      return { x: (p.x / 100) * this.scene3d.piecesLayer.clientWidth, y: (p.y / 100) * this.scene3d.piecesLayer.clientHeight };
    }
    const pos = this.scene3d.cellToWorld(cell);
    const screen = this.scene3d.worldToScreen(pos.clone().add(new THREE.Vector3(0, 0.5, 0)));
    return screen;
  }

  place(player, instant = false) {
    if (!this.players.includes(player)) this.players.push(player);
    if (!player.object3D) {
      player.object3D = this.scene3d.addPiece(player.creatureId, player.position, player.id);
    }
    if (this.fallback) {
      const p = this.scene3d.cellToScreen(player.position);
      const off = this.fallbackOffsets[player.id - 1] || { x: 0, y: 0 };
      player.object3D.style.left = `${p.x + off.x}%`;
      player.object3D.style.top = `${p.y + off.y}%`;
      return;
    }
    const pos = this.scene3d.cellToWorld(player.position);
    const off = this.playerOffsets[player.id - 1] || new THREE.Vector3();
    const final = pos.clone().add(off);
    player.object3D.userData.basePos = final.clone();
    this.scene3d.setPieceOffset(player.object3D, off);
    if (instant) player.object3D.position.copy(final);
  }

  refreshPieces() {
    this.players.forEach((p) => this.place(p, true));
  }

  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  async animateStep(player, fromCell, toCell) {
    if (this.fallback) {
      return this.animateStepFallback(player, fromCell, toCell);
    }
    const obj = player.object3D;
    const off = this.playerOffsets[player.id - 1] || new THREE.Vector3();
    const a = this.scene3d.cellToWorld(fromCell);
    const b = this.scene3d.cellToWorld(toCell);
    const c = this.arcControl(fromCell, toCell);
    const start = performance.now();
    const dur = this.stepDuration;
    await new Promise((resolve) => {
      const frame = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = this.easeInOut(t);
        const x = (1 - e) * (1 - e) * a.x + 2 * (1 - e) * e * c.x + e * e * b.x;
        const z = (1 - e) * (1 - e) * a.z + 2 * (1 - e) * e * c.z + e * e * b.z;
        const hopY = 0.18 + Math.sin(t * Math.PI) * 0.28;
        obj.position.set(x + off.x, hopY, z + off.z);
        obj.userData.basePos = new THREE.Vector3(x + off.x, hopY, z + off.z);
        if (window.magicFX && now - this.lastTrail > 50) {
          this.lastTrail = now;
          const sp = this.scene3d.worldToScreen(new THREE.Vector3(x + off.x, hopY, z + off.z));
          magicFX.trail(sp.x, sp.y, player.id);
        }
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  async animateStepFallback(player, fromCell, toCell) {
    const obj = player.object3D;
    const off = this.fallbackOffsets[player.id - 1] || { x: 0, y: 0 };
    const a = this.scene3d.cellToScreen(fromCell);
    const b = this.scene3d.cellToScreen(toCell);
    const start = performance.now();
    const dur = this.stepDuration;
    await new Promise((resolve) => {
      const frame = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = this.easeInOut(t);
        const x = (1 - e) * a.x + e * b.x + off.x;
        const y = (1 - e) * a.y + e * b.y + off.y;
        obj.style.left = `${x}%`;
        obj.style.top = `${y}%`;
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  arcControl(cellA, cellB) {
    const a = this.scene3d.cellToWorld(cellA);
    const b = this.scene3d.cellToWorld(cellB);
    const mx = (a.x + b.x) / 2;
    const mz = (a.z + b.z) / 2;
    const dx = mx - 0;
    const dz = mz - 0.4;
    const len = Math.hypot(dx, dz) || 1;
    const bow = 0.18;
    return new THREE.Vector3(mx + (dx / len) * bow, 0.18, mz + (dz / len) * bow);
  }

  async moveStepByStep(player, target) {
    const dir = target >= player.position ? 1 : -1;
    player.object3D.userData.animating = true;
    while (player.position !== target) {
      const from = player.position;
      const to = from + dir;
      await this.animateStep(player, from, to);
      player.position = to;
    }
    player.object3D.userData.animating = false;
    if (this.fallback) {
      this.place(player, true);
      return;
    }
    const pos = this.scene3d.cellToWorld(player.position);
    const off = this.playerOffsets[player.id - 1] || new THREE.Vector3();
    player.object3D.userData.basePos = pos.clone().add(off);
    player.object3D.position.copy(pos).add(off);
  }

  async jumpTo(player, target) {
    player.object3D.userData.animating = true;
    await this.animateStep(player, player.position, target);
    player.position = target;
    player.object3D.userData.animating = false;
    if (this.fallback) {
      this.place(player, true);
      return;
    }
    const pos = this.scene3d.cellToWorld(player.position);
    const off = this.playerOffsets[player.id - 1] || new THREE.Vector3();
    player.object3D.userData.basePos = pos.clone().add(off);
    player.object3D.position.copy(pos).add(off);
  }

  nextLogo(cell) {
    const logos = this.data.rules.logoCells;
    const next = logos.find((v) => v > cell);
    return next || logos[0];
  }
}
