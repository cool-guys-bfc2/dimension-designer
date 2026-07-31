registerBlock({
  name: "ruby",
  displayName: "Ruby Block",
  colors: { top: 0xd11a3b, side: 0xa01530, bottom: 0x700f22 },
  solid: true, opaque: true, hardness: 2
});
registerBlock({
  name: "deathstone",
  displayName: "Death Stone",
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
    c.say(`I am a ${c.entity.def.displayName} and i am very lonely! Can you find me?`);
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
registerEntity({
  name: "fireman", displayName: "FireMan",
  color: 0xd17f36, size: [0.7, 1.2, 0.4], speed: 1.6,
  hostile: false, maxHealth: 20, behavior: "innocent",
  loot: [{ item: "pork", min: 2, max: 4, chance: 1 }],
});
registerDimension({
  name: "nether",
  displayName: "Nether",
  skyColor: 0xc94908,
  seedOffset: 57,
  gravity: 0.2,
  nostructures:false,
  surfaceBlock: "deathgrass",
  fillerBlock: "deathsoil",
  stoneBlock: "deathstone",
  entities: ["fireman",'pig','cow','sheep']
});
