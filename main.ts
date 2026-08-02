let new = true;
if ( new ) {
  runCommand('/tp -50 36 -150');
}
registerBlock({
  name: "ruby",
  displayName: "Ruby Block",
  tool : 'pickaxe',
  colors: { top: 0xd11a3b, side: 0xa01530, bottom: 0x700f22 },
  solid: true, opaque: true, hardness: 2
});
registerBlock({
  name: "deathstone",
  displayName: "Death Stone",
  tool : 'pickaxe',
  colors: { top: 0x965535, side: 0x965535, bottom: 0x965535 },
  solid: true, opaque: true, hardness: 2
});
registerBlock({
  name: "deathgrass",
  displayName: "Death Grass",
  colors: { top: 0x2c9671, side: 0x965535, bottom: 0x965535 },
  solid: true, opaque: true, hardness: 2
});
registerBlock({
  name: "deathsoil",
  displayName: "Death Soil",
  colors: { top: 0xc24e13, side: 0xc24e13, bottom: 0xc24e13 },
  solid: true, opaque: true, hardness: 2
});
registerBehavior({
  name: "innocent",
  onUpdate: (c) => {
    if (c.distance < 8 && c.distance > 2) c.chase();
    else c.wander();
  },
  onSpawn: (c) => {
    c.entity.memory.greeted = false;
  },
  onPlayerNear: (c) => {
    if (!c.entity.memory.greeted) {
      c.entity.memory.greeted = true;
      c.say(`A ${c.entity.def.displayName} says hello!`);
    }
  },
  onDeath: (c) => {
    if (c.entity.memory.greeted) {
      c.say(`You killed him! He wanted to be your friend! <Awkard Silence>`);
    }
  },
  onHurt: (c) => {
    if (c.entity.memory.greeted) {
      c.say(`Hey! That Hurts.`);
    }
  },
});
registerBehavior({
  name: "innocent",
  onUpdate: (c) => {
    if (c.distance < 8 && c.distance > 2) c.chase();
    else c.wander();
  },
  onSpawn: (c) => {
    c.entity.memory.greeted = false;
  },
  onPlayerNear: (c) => {
    if (!c.entity.memory.greeted) {
      c.entity.memory.greeted = true;
      c.say(`A ${c.entity.def.displayName} says hello!`);
    }
  },
  onDeath: (c) => {
    if (c.entity.memory.greeted) {
      c.say(`You killed him! He wanted to be your friend! <Awkard Silence>`);
    }
  },
  onHurt: (c) => {
    if (c.entity.memory.greeted) {
      c.say(`Hey! That Hurts.`);
    }
  },
});
function interval(x: number): boolean {
    return Date.now() % x === 0;
}
registerBehavior({
  name: "archer",
  onUpdate: (c) => {
    if (c.distance < 20) {
      if (interval(20000)) runCommand(`/spawn ${c.entity.def.projectile}`);
      c.chase();
    };
    if (c.distance > 20) c.wander();
  },
});
registerBehavior({
  name: "projectile",
  onUpdate: (c) => {
    if (c.distance < 3 && c.distance > 0) c.chase();
    if (interval(200)) c.entity.def.maxHealth=0;
  },
});
registerEntity({
  name: "fireman", displayName: "FireMan",
  color: 0xd17f36, size: [0.7, 1.2, 0.4], speed: 1.6,
  hostile: false, maxHealth: 16, behavior: "innocent",
  loot: [{ item: "pork", min: 2, max: 4, chance: 1 }],
});
registerEntity({
  name: "small-zombie", displayName: "Zombie-Minion",
  color: 0xd17f36, size: [0.7, 1.2, 0.4], speed: 0.7,
  hostile: true, maxHealth: 2, behavior: "projectile",
  loot: [{ item: "bone", min: 1, max: 2, chance: 1 }],
});
registerEntity({
  name: "zombie_arch", displayName: "Zombie-Arch",
  color: 0xd17f36, size: [0.7, 0.5, 0.4], speed: 1.6,
  hostile: false, maxHealth: 6, behavior: "archer", projectile: "small-zombie",
  loot: [{ item: "rotten_flesh", min: 0, max: 1, chance: 1 }],
});
registerStructure({
  name: "nether_hut",
  rarity: 400,
  build: () => {
    const parts: Array<[number, number, number, string]> = [];
    const w = 4, d = 4, h = 3;
    for (let x = 0; x < w; x++)
      for (let z = 0; z < d; z++)
        for (let y = 0; y < h; y++) {
          const edge = x === 0 || x === w - 1 || z === 0 || z === d - 1;
          if (edge) parts.push([x, y, z, "deathdirt"]);
        }
    // Roof
    for (let x = 0; x < w; x++)
      for (let z = 0; z < d; z++) parts.push([x, h, z, Math.random() < 0.8 ? "deathstone" : "ruby" ]);
    // Door hole
    parts.push([1, 0, 0, "sand"]); // dummy — overwritten to air below
    return parts.filter(p => !(p[0] === 1 && p[1] === 0 && p[2] === 0) && !(p[0] === 1 && p[1] === 1 && p[2] === 0));
  },
});

registerDimension({
  name: "nether",
  displayName: "Nether",
  skyColor: 0xc94908,
  seedOffset: 511,
  gravity: 0.05,
  structures: ['nether_hut'],
  surfaceBlock: "deathgrass",
  fillerBlock: "deathsoil",
  stoneBlock: "deathstone",
  liquidBlock: 'water',
  music: 'caves',
  seaLevel: 27,
  mobs: ["fireman",'pig','cow','sheep']
});
new = false;
