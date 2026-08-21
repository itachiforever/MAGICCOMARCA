class CreaturePicker {
  constructor() {
    this.creatures = window.CreatureFactory.list();
    this.selections = [];
    this.currentIndex = 0;
    this.totalPlayers = 1;
    this.onComplete = null;

    this.modal = document.getElementById('creatureModal');
    this.titleEl = document.getElementById('creaturePickerTitle');
    this.subtitleEl = document.getElementById('creaturePickerSubtitle');
    this.stage = document.getElementById('creatureStage');
    this.nameEl = document.getElementById('creatureName');
    this.descEl = document.getElementById('creatureDesc');
    this.dotsEl = document.getElementById('creatureDots');
    this.gridEl = document.getElementById('creatureGrid');
    this.confirmBtn = document.getElementById('creatureConfirmBtn');
    this.backBtn = document.getElementById('creatureBackBtn');

    this.setupMiniScene();
    this.buildGrid();
    this.buildDots();
    this.bindEvents();
  }

  setupMiniScene() {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      this.renderer = null;
      this.showFallbackStage();
      return;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(280, 280);
    this.stage.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set(0, 1.6, 3.6);
    this.camera.lookAt(0, 0.7, 0);

    const ambient = new THREE.AmbientLight(0xffe4c0, 0.6);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff0d0, 1.2);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xb48dff, 0.5);
    rim.position.set(-2, 2, -2);
    this.scene.add(rim);
    const warm = new THREE.PointLight(0xffd86b, 0.5, 6);
    warm.position.set(0, 1.5, 1);
    this.scene.add(warm);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.2, 0.12, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a1a1e, roughness: 0.8 })
    );
    platform.position.y = -0.06;
    platform.receiveShadow = true;
    this.scene.add(platform);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.04, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xffd86b, emissive: 0xffd86b, emissiveIntensity: 0.4, roughness: 0.4 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    this.scene.add(ring);
    this.ring = ring;

    this.clock = new THREE.Clock();
    this.currentCreature = null;
    this.renderer.setAnimationLoop(() => this.render());
  }

  showFallbackStage() {
    this.fallbackEmoji = document.createElement('div');
    this.fallbackEmoji.className = 'creature-fallback';
    this.stage.appendChild(this.fallbackEmoji);
  }

  buildGrid() {
    this.gridEl.innerHTML = '';
    this.creatures.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'creature-thumb';
      btn.dataset.id = c.id;
      btn.innerHTML = `<span class="creature-thumb-emoji">${c.emoji}</span><span class="creature-thumb-name">${c.name}</span>`;
      btn.onclick = () => this.showCreature(c.id);
      this.gridEl.appendChild(btn);
    });
  }

  buildDots() {
    this.dotsEl.innerHTML = '';
    for (let i = 0; i < this.totalPlayers; i++) {
      const d = document.createElement('div');
      d.className = 'picker-dot';
      this.dotsEl.appendChild(d);
    }
    this.updateDots();
  }

  updateDots() {
    [...this.dotsEl.children].forEach((d, i) => {
      d.classList.toggle('active', i === this.currentIndex);
      d.classList.toggle('done', i < this.currentIndex);
    });
  }

  showCreature(id) {
    const c = this.creatures.find((x) => x.id === id);
    this.nameEl.textContent = c.name;
    this.descEl.textContent = this.description(id);
    this.currentCreatureId = id;

    [...this.gridEl.children].forEach((b) => {
      b.classList.toggle('selected', b.dataset.id === id);
    });

    if (!this.renderer) {
      this.fallbackEmoji.textContent = c.emoji;
      return;
    }

    if (this.currentCreature) {
      this.scene.remove(this.currentCreature);
      this.currentCreature.traverse((c) => {
        if (c.isMesh) { c.geometry.dispose(); c.material.dispose(); }
      });
    }
    this.currentCreature = window.CreatureFactory.build(id);
    this.currentCreature.traverse((c) => {
      if (c.isMesh) c.castShadow = true;
    });
    this.currentCreature.scale.setScalar(0.85);
    this.scene.add(this.currentCreature);
  }

  description(id) {
    const map = {
      dragon: 'Fiero y valiente. Su aliento ardiente ilumina el camino.',
      sirena: 'Elegante y sabia. Domina las aguas y los secretos del río.',
      grifon: 'Ágil y leal. Vigila desde lo alto y protege a su jinete.',
      hada: 'Mágica y curiosa. Con su varita concede deseos a quien respeta.',
      gigante: 'Fuerte y resistente. Pocos obstáculos detienen su paso.',
      duende: 'Travieso y astuto. Conoce atajos y tesoros escondidos.',
    };
    return map[id] || '';
  }

  bindEvents() {
    this.confirmBtn.onclick = () => this.confirm();
    this.backBtn.onclick = () => this.back();
  }

  open(totalPlayers, onComplete) {
    this.totalPlayers = totalPlayers;
    this.selections = [];
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this.buildDots();
    this.showCreature(this.creatures[0].id);
    this.titleEl.textContent = `Jugador 1 de ${totalPlayers}`;
    this.subtitleEl.textContent = 'Elige tu criatura fantástica para la aventura.';
    this.modal.classList.remove('hidden');
  }

  confirm() {
    if (!this.currentCreatureId) return;
    this.selections.push(this.currentCreatureId);
    this.currentIndex++;
    if (this.currentIndex >= this.totalPlayers) {
      this.modal.classList.add('hidden');
      const sel = this.selections.slice();
      this.onComplete && this.onComplete(sel);
      return;
    }
    this.titleEl.textContent = `Jugador ${this.currentIndex + 1} de ${this.totalPlayers}`;
    this.updateDots();
    const next = this.creatures[0].id;
    this.showCreature(next);
  }

  back() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selections.pop();
      this.titleEl.textContent = `Jugador ${this.currentIndex + 1} de ${this.totalPlayers}`;
      this.updateDots();
    }
  }

  render() {
    if (!this.renderer) return;
    const t = this.clock.getElapsedTime();
    if (this.currentCreature && this.currentCreature.userData.update) {
      this.currentCreature.userData.update(t);
    }
    if (this.currentCreature) {
      this.currentCreature.rotation.y = t * 0.6;
    }
    if (this.ring) this.ring.rotation.z = t * 0.5;
    this.renderer.render(this.scene, this.camera);
  }
}

window.CreaturePicker = CreaturePicker;
