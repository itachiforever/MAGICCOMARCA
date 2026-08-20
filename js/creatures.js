function mesh(geo, color, opts = {}) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.15,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
    flatShading: opts.flat ?? false,
  });
  const m = new THREE.Mesh(geo, mat);
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.rot) m.rotation.set(...opts.rot);
  if (opts.scale) m.scale.set(...opts.scale);
  if (opts.name) m.name = opts.name;
  return m;
}

class CreatureFactory {
  static list() {
    return [
      { id: 'dragon',  name: 'Dragón',  emoji: '🐉', color: '#e84754' },
      { id: 'sirena',  name: 'Sirena',   emoji: '🧜', color: '#2dbf9d' },
      { id: 'grifon',  name: 'Grifón',   emoji: '🦅', color: '#f2c744' },
      { id: 'hada',    name: 'Hada',     emoji: '🧚', color: '#c9a6ff' },
      { id: 'gigante', name: 'Gigante',  emoji: '🗿', color: '#b07a4a' },
      { id: 'duende',  name: 'Duende',   emoji: '👺', color: '#4caf50' },
    ];
  }

  static build(id) {
    const builders = {
      dragon: CreatureFactory.dragon,
      sirena: CreatureFactory.sirena,
      grifon: CreatureFactory.grifon,
      hada: CreatureFactory.hada,
      gigante: CreatureFactory.gigante,
      duende: CreatureFactory.duende,
    };
    const fn = builders[id] || builders.dragon;
    return fn();
  }

  static dragon() {
    const g = new THREE.Group();
    const body = mesh(new THREE.SphereGeometry(0.42, 20, 16), 0xe84754, { pos: [0, 0.42, 0], scale: [1, 0.78, 1.35], flat: true });
    g.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.3, 16, 12), 0xf6c8a0, { pos: [0, 0.34, 0.12], scale: [0.7, 0.5, 0.8], flat: true });
    g.add(belly);
    const head = mesh(new THREE.SphereGeometry(0.3, 18, 14), 0xe84754, { pos: [0, 0.78, 0.42], flat: true });
    g.add(head);
    const snout = mesh(new THREE.ConeGeometry(0.16, 0.3, 12), 0xd63a47, { pos: [0, 0.72, 0.62], rot: [Math.PI / 2, 0, 0] });
    g.add(snout);
    [-0.12, 0.12].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.06, 10, 8), 0xffffff, { pos: [x, 0.86, 0.56] }));
      g.add(mesh(new THREE.SphereGeometry(0.03, 8, 6), 0x111111, { pos: [x, 0.86, 0.61] }));
    });
    [-0.16, 0.16].forEach((x) => {
      g.add(mesh(new THREE.ConeGeometry(0.07, 0.26, 10), 0xf2c744, { pos: [x, 1.04, 0.36], rot: [-0.5, 0, 0] }));
    });
    const wingL = new THREE.Group();
    wingL.add(mesh(new THREE.ConeGeometry(0.34, 0.7, 4), 0xc9313e, { pos: [0, 0.3, 0], rot: [0, 0, 0.9], flat: true, scale: [1, 1, 0.12] }));
    wingL.position.set(-0.34, 0.6, 0.05);
    wingL.rotation.z = 0.5;
    g.add(wingL);
    const wingR = wingL.clone();
    wingR.position.x = 0.34;
    wingR.rotation.z = -0.5;
    g.add(wingR);
    const tail = mesh(new THREE.ConeGeometry(0.18, 0.6, 12), 0xe84754, { pos: [0, 0.4, -0.62], rot: [Math.PI / 2, 0, Math.PI], flat: true });
    g.add(tail);
    [[-0.2, 0.16], [0.2, 0.16], [-0.2, -0.16], [0.2, -0.16]].forEach(([x, z]) => {
      g.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.2, 8), 0xd63a47, { pos: [x, 0.1, z] }));
    });
    g.userData.wings = [wingL, wingR];
    g.userData.update = (t) => {
      g.userData.bobY = Math.sin(t * 2.2) * 0.04;
      const flap = Math.sin(t * 4) * 0.35;
      wingL.rotation.z = 0.5 + flap;
      wingR.rotation.z = -0.5 - flap;
    };
    return g;
  }

  static sirena() {
    const g = new THREE.Group();
    const torso = mesh(new THREE.SphereGeometry(0.3, 18, 14), 0xf2c9a8, { pos: [0, 0.62, 0], scale: [1, 1.15, 0.9], flat: true });
    g.add(torso);
    const head = mesh(new THREE.SphereGeometry(0.25, 18, 14), 0xf2c9a8, { pos: [0, 0.98, 0], flat: true });
    g.add(head);
    const hair = mesh(new THREE.SphereGeometry(0.27, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), 0x2dbf9d, { pos: [0, 1.0, 0], flat: true });
    g.add(hair);
    [-0.16, 0.16].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), 0xffffff, { pos: [x, 1.0, 0.18] }));
      g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), 0x111111, { pos: [x, 1.0, 0.22] }));
    });
    [-0.28, 0.28].forEach((x) => {
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), 0xf2c9a8, { pos: [x, 0.6, 0.1], rot: [0, 0, x > 0 ? -0.4 : 0.4] }));
    });
    const tail = mesh(new THREE.CylinderGeometry(0.2, 0.06, 0.55, 12), 0x2dbf9d, { pos: [0, 0.28, 0], flat: true });
    g.add(tail);
    const fin = mesh(new THREE.ConeGeometry(0.22, 0.28, 4), 0x377dff, { pos: [0, 0.02, 0], rot: [Math.PI, 0, 0], flat: true, scale: [1, 1, 0.3] });
    g.add(fin);
    g.userData.update = (t) => {
      g.userData.bobY = Math.sin(t * 1.8) * 0.05;
      g.rotation.y = Math.sin(t * 1.1) * 0.18;
      tail.rotation.z = Math.sin(t * 2) * 0.12;
    };
    return g;
  }

  static grifon() {
    const g = new THREE.Group();
    const body = mesh(new THREE.SphereGeometry(0.4, 20, 16), 0xd9a437, { pos: [0, 0.46, 0], scale: [1, 0.85, 1.25], flat: true });
    g.add(body);
    const head = mesh(new THREE.SphereGeometry(0.26, 18, 14), 0xf2c744, { pos: [0, 0.8, 0.34], flat: true });
    g.add(head);
    const beak = mesh(new THREE.ConeGeometry(0.1, 0.22, 10), 0xe8a52a, { pos: [0, 0.76, 0.56], rot: [Math.PI / 2, 0, 0] });
    g.add(beak);
    [-0.12, 0.12].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), 0xffffff, { pos: [x, 0.88, 0.42] }));
      g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), 0x111111, { pos: [x, 0.88, 0.46] }));
    });
    const wingL = new THREE.Group();
    wingL.add(mesh(new THREE.ConeGeometry(0.4, 0.8, 4), 0xc98a2e, { rot: [0, 0, 0.9], flat: true, scale: [1, 1, 0.12] }));
    wingL.position.set(-0.36, 0.62, 0);
    wingL.rotation.z = 0.45;
    g.add(wingL);
    const wingR = wingL.clone();
    wingR.position.x = 0.36;
    wingR.rotation.z = -0.45;
    g.add(wingR);
    const tail = mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.4, 10), 0xd9a437, { pos: [0, 0.5, -0.4], rot: [Math.PI / 2, 0, Math.PI], flat: true });
    g.add(tail);
    [[-0.18, 0.2], [0.18, 0.2], [-0.18, -0.2], [0.18, -0.2]].forEach(([x, z]) => {
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.22, 8), 0xe8a52a, { pos: [x, 0.1, z] }));
    });
    g.userData.wings = [wingL, wingR];
    g.userData.update = (t) => {
      g.userData.bobY = Math.sin(t * 2.4) * 0.045;
      const flap = Math.sin(t * 3.5) * 0.4;
      wingL.rotation.z = 0.45 + flap;
      wingR.rotation.z = -0.45 - flap;
    };
    return g;
  }

  static hada() {
    const g = new THREE.Group();
    const body = mesh(new THREE.SphereGeometry(0.26, 18, 14), 0xc9a6ff, { pos: [0, 0.48, 0], scale: [1, 1.2, 1], flat: true });
    g.add(body);
    const head = mesh(new THREE.SphereGeometry(0.22, 18, 14), 0xf2c9a8, { pos: [0, 0.82, 0], flat: true });
    g.add(head);
    const hair = mesh(new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), 0xff9ad5, { pos: [0, 0.84, 0], flat: true });
    g.add(hair);
    [-0.13, 0.13].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), 0xffffff, { pos: [x, 0.84, 0.16] }));
      g.add(mesh(new THREE.SphereGeometry(0.022, 8, 6), 0x4a2a6a, { pos: [x, 0.84, 0.2] }));
    });
    const wingL = new THREE.Group();
    wingL.add(mesh(new THREE.ConeGeometry(0.26, 0.5, 4), 0xff9ad5, { rot: [0, 0, 0.8], flat: true, scale: [1, 1, 0.08], transparent: true, opacity: 0.75 }));
    wingL.position.set(-0.22, 0.55, 0);
    wingL.rotation.z = 0.4;
    g.add(wingL);
    const wingR = wingL.clone();
    wingR.position.x = 0.22;
    wingR.rotation.z = -0.4;
    g.add(wingR);
    const wand = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 6), 0x8a5a2a, { pos: [0.22, 0.5, 0.18], rot: [0, 0, -0.5] });
    g.add(wand);
    const star = mesh(new THREE.OctahedronGeometry(0.07), 0xffd86b, { pos: [0.3, 0.62, 0.22], emissive: 0xffd86b, emissiveIntensity: 0.6 });
    g.add(star);
    g.userData.wings = [wingL, wingR];
    g.userData.update = (t) => {
      g.userData.bobY = 0.08 + Math.sin(t * 2.6) * 0.09;
      const flap = Math.sin(t * 5) * 0.3;
      wingL.rotation.z = 0.4 + flap;
      wingR.rotation.z = -0.4 - flap;
      star.rotation.y = t * 2;
    };
    return g;
  }

  static gigante() {
    const g = new THREE.Group();
    const body = mesh(new THREE.BoxGeometry(0.62, 0.72, 0.46), 0x9b7653, { pos: [0, 0.56, 0], flat: true });
    g.add(body);
    const head = mesh(new THREE.SphereGeometry(0.3, 18, 14), 0xc49a72, { pos: [0, 1.08, 0], flat: true });
    g.add(head);
    [-0.11, 0.11].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), 0x111111, { pos: [x, 1.1, 0.24] }));
    });
    const brow = mesh(new THREE.BoxGeometry(0.22, 0.04, 0.06), 0x5a3a2a, { pos: [0, 1.16, 0.26] });
    g.add(brow);
    [-0.4, 0.4].forEach((x) => {
      const arm = mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10), 0x9b7653, { pos: [x, 0.56, 0], rot: [0, 0, x > 0 ? 0.2 : -0.2], flat: true });
      g.add(arm);
    });
    [-0.18, 0.18].forEach((x) => {
      g.add(mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.34, 10), 0x8a6248, { pos: [x, 0.16, 0], flat: true }));
    });
    const club = mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 8), 0x6a4a30, { pos: [0.5, 0.7, 0.1], rot: [0, 0, -0.3], flat: true });
    g.add(club);
    const clubTop = mesh(new THREE.SphereGeometry(0.12, 12, 10), 0x6a4a30, { pos: [0.58, 0.92, 0.12], flat: true });
    g.add(clubTop);
    g.userData.update = (t) => {
      g.userData.bobY = Math.sin(t * 1.4) * 0.03;
      g.rotation.y = Math.sin(t * 0.7) * 0.1;
    };
    return g;
  }

  static duende() {
    const g = new THREE.Group();
    const body = mesh(new THREE.SphereGeometry(0.26, 18, 14), 0x4caf50, { pos: [0, 0.32, 0], scale: [1, 0.9, 0.9], flat: true });
    g.add(body);
    const head = mesh(new THREE.SphereGeometry(0.3, 18, 14), 0x5cc06a, { pos: [0, 0.66, 0], flat: true });
    g.add(head);
    [-0.13, 0.13].forEach((x) => {
      g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), 0xffffff, { pos: [x, 0.7, 0.22] }));
      g.add(mesh(new THREE.SphereGeometry(0.025, 8, 6), 0x111111, { pos: [x, 0.7, 0.27] }));
    });
    const nose = mesh(new THREE.ConeGeometry(0.05, 0.12, 8), 0x4caf50, { pos: [0, 0.6, 0.3], rot: [Math.PI / 2, 0, 0] });
    g.add(nose);
    [-0.28, 0.28].forEach((x) => {
      g.add(mesh(new THREE.ConeGeometry(0.07, 0.16, 8), 0x5cc06a, { pos: [x, 0.74, 0.05], rot: [0, 0, x > 0 ? -0.6 : 0.6], flat: true }));
    });
    const hat = mesh(new THREE.ConeGeometry(0.24, 0.4, 12), 0xe84754, { pos: [0, 1.0, 0], flat: true });
    g.add(hat);
    [-0.13, 0.13].forEach((x) => {
      g.add(mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.2, 8), 0x3a8a40, { pos: [x, 0.08, 0.04] }));
    });
    g.userData.update = (t) => {
      g.userData.bobY = Math.sin(t * 3) * 0.05;
      g.rotation.y = Math.sin(t * 1.6) * 0.16;
    };
    return g;
  }
}

window.CreatureFactory = CreatureFactory;
