class Scene3D {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.pieces = [];
    this.clock = new THREE.Clock();
    this.fallback = false;

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      this.initFallback();
      return;
    }

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x1a1014, 7, 16);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(0, 5.2, 4.6);
    this.camera.lookAt(0, 0, 0.4);

    this.setupLights();
    this.setupBoard();
    this.setupGround();

    this.userOrbit = false;
    this.orbitAngle = 0;
    this.orbitRadius = 6.2;
    this.orbitTarget = new THREE.Vector3(0, 0, 0.4);

    this.setupControls();
    this.onResize();
    window.addEventListener('resize', () => this.onResize());

    this.renderer.setAnimationLoop(() => this.render());
    this.startAutoRotate();
  }

  initFallback() {
    this.fallback = true;
    this.boardWidth = 4.2;
    this.boardHeight = this.boardWidth / (this.data.imageWidth / this.data.imageHeight);
    this.boardHalfW = this.boardWidth / 2;
    this.boardHalfH = this.boardHeight / 2;

    this.container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'board-fallback';

    const img = document.createElement('img');
    img.src = 'assets/board/tablero_original.png';
    img.alt = 'Tablero';
    wrap.appendChild(img);

    const note = document.createElement('p');
    note.textContent = 'Modo simplificado (sin WebGL). Las criaturas se muestran con emojis.';
    wrap.appendChild(note);

    this.piecesLayer = document.createElement('div');
    this.piecesLayer.className = 'pieces-layer';
    wrap.appendChild(this.piecesLayer);

    this.container.appendChild(wrap);
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffe4c0, 0.55);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfff0d0, 1.1);
    key.position.set(3, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0xb48dff, 0.4);
    rim.position.set(-3, 4, -3);
    this.scene.add(rim);

    const warm = new THREE.PointLight(0xffd86b, 0.6, 8);
    warm.position.set(0, 2.5, 0);
    this.scene.add(warm);
  }

  setupBoard() {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('assets/board/tablero_original.png');
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    const aspect = this.data.imageWidth / this.data.imageHeight;
    const boardW = 4.2;
    const boardH = boardW / aspect;

    const geo = new THREE.BoxGeometry(boardW, 0.16, boardH);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.05 });
    this.board = new THREE.Mesh(geo, mat);
    this.board.position.y = 0;
    this.board.receiveShadow = true;
    this.scene.add(this.board);

    this.boardWidth = boardW;
    this.boardHeight = boardH;
    this.boardHalfW = boardW / 2;
    this.boardHalfH = boardH / 2;
  }

  setupGround() {
    const geo = new THREE.CircleGeometry(8, 48);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2a1a1e, roughness: 0.95 });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.09;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  setupControls() {
    let isDown = false;
    let lastX = 0, lastY = 0;
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      isDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      this.userOrbit = true;
      this._userInteracted = true;
    });
    window.addEventListener('pointerup', () => { isDown = false; });
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      this.orbitAngle -= dx * 0.006;
      this.orbitRadius = Math.max(3.5, Math.min(9, this.orbitRadius + dy * 0.01));
    });

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.orbitRadius = Math.max(3.5, Math.min(9, this.orbitRadius + e.deltaY * 0.004));
      this.userOrbit = true;
      this._userInteracted = true;
    }, { passive: false });
  }

  cellToWorld(cell) {
    const [x, y] = this.data.cells[cell];
    const nx = (x / this.data.imageWidth) * this.boardWidth - this.boardHalfW;
    const nz = (y / this.data.imageHeight) * this.boardHeight - this.boardHalfH;
    return new THREE.Vector3(nx, 0.18, nz);
  }

  cellToScreen(cell) {
    const [x, y] = this.data.cells[cell];
    const px = (x / this.data.imageWidth) * 100;
    const py = (y / this.data.imageHeight) * 100;
    return { x: px, y: py };
  }

  worldToScreen(vec3) {
    const v = vec3.clone();
    v.project(this.camera);
    const r = this.renderer.domElement.getBoundingClientRect();
    return {
      x: (v.x * 0.5 + 0.5) * r.width + r.left,
      y: (-v.y * 0.5 + 0.5) * r.height + r.top,
    };
  }

  addPiece(creature, cell, playerId) {
    if (this.fallback) {
      return this.addFallbackPiece(creature, cell, playerId);
    }
    const obj = (typeof creature === 'string')
      ? window.CreatureFactory.build(creature)
      : creature;
    obj.traverse((c) => {
      if (c.isMesh) { c.castShadow = true; c.receiveShadow = false; }
    });
    const pos = this.cellToWorld(cell);
    obj.position.copy(pos);
    obj.userData.playerId = playerId;
    obj.userData.basePos = pos.clone();
    const scale = 0.62;
    obj.scale.setScalar(scale);
    this.scene.add(obj);
    this.pieces.push(obj);
    return obj;
  }

  addFallbackPiece(creature, cell, playerId) {
    const id = typeof creature === 'string' ? creature : 'dragon';
    const c = window.CreatureFactory.list().find((x) => x.id === id) || window.CreatureFactory.list()[0];
    const el = document.createElement('div');
    el.className = `piece p${playerId}`;
    el.textContent = c.emoji;
    el.style.fontSize = '20px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    const p = this.cellToScreen(cell);
    el.style.left = `${p.x}%`;
    el.style.top = `${p.y}%`;
    el.userData = { playerId, cell };
    this.piecesLayer.appendChild(el);
    this.pieces.push(el);
    return el;
  }

  movePieceTo(piece, cell, instant = false) {
    if (this.fallback) {
      const p = this.cellToScreen(cell);
      piece.style.left = `${p.x}%`;
      piece.style.top = `${p.y}%`;
      piece.userData.cell = cell;
      return;
    }
    const pos = this.cellToWorld(cell);
    piece.userData.basePos = pos.clone();
    if (instant) {
      piece.position.copy(pos);
    }
    return pos;
  }

  setPieceOffset(piece, offsetVec) {
    if (this.fallback) return;
    piece.userData.offset = offsetVec.clone();
  }

  render() {
    if (this.fallback) return;
    const t = this.clock.getElapsedTime();
    for (const p of this.pieces) {
      if (p.userData.update) p.userData.update(t);
      if (p.userData.bobY != null && !p.userData.animating) {
        p.position.y = (p.userData.basePos ? p.userData.basePos.y : 0.18) + p.userData.bobY;
      }
    }

    if (this.userOrbit) {
      this.camera.position.x = Math.sin(this.orbitAngle) * this.orbitRadius;
      this.camera.position.z = Math.cos(this.orbitAngle) * this.orbitRadius * 0.7;
      this.camera.position.y = this.orbitRadius * 0.65;
      this.camera.lookAt(this.orbitTarget);
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (this.fallback) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  startAutoRotate() {
    this.userOrbit = true;
    this.orbitAngle = 0;
    let last = performance.now();
    const spin = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!this._userInteracted) this.orbitAngle += dt * 0.25;
      requestAnimationFrame(spin);
    };
    requestAnimationFrame(spin);
  }
}

window.Scene3D = Scene3D;
