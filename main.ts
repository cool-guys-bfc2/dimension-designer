import * as T from "./textures";
registerBlock({
  name: "lava",
  displayName: "Lava",
  colors: { top: 0xe65d05, side: 0xe65d05, bottom: 0xe65d05 },
  solid: false, opaque: false, hardness: 0,
});
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
function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 2. Implement the safe retrieval function
function getFunctionFromObject<T, X extends FunctionKeys<T>>(obj: T, x: X): T[X] {
  return obj[x];
}
//Add single-tool
function addTool(material: string, kind: string, strength: number, color: any, speed: number, damage: number): void {
    const id = `${material}_${kind}`;
    const display = `${title(material) ${title(kind)}`;
    const x=getFunctionFrom(T,`${title(kind)}Icon`);
    const d = {
      displayName: display,
      name: id,
      color: color,
      stackSize: 1,
      tool: { kind: kind, speed: speed, damage : damage, durability: strenth},
      texture: x(color)
    };
    registerItem(d)
}
//make number at least 1
function nz(x: number): number {
  return Math.max(1, x);
}
//Add toolset using material, sword-damage, strength/durability ,color, pickaxe-speed
function addToolSet(material: string, damage: number, durability: number, color: any, speed: number): void {
  addTool(material, 'axe', durability, color, speed-2, nz(damage+1));
  addTool(material, 'pickaxe', durability, color, speed, nz(damage-2));
  addTool(material, 'shovel', durability, color, speed, nz(damage-2));
  addTool(material, 'sword', durability, color, speed-2, nz(damage));
}
addToolSet('diamond',8,1561,0x30bcd1,8);
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
registerEntity({
  name: "wolf", displayName: "Wolf",
  color: 0x137846, size: [1.2, 0.7, 0.5], speed: 1.6,
  hostile: true, maxHealth: 16, behavior: "chase",
  targets:["sheep","pig","wolf"],attackDamage:2,attackRange:2,
  loot: [],
});
registerStructure({
  name: "nether_hut",
  rarity: 400,
  underwater: false,
  spacing: 48,
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
registerStructure({
  name: "end_hut",
  rarity: 400,
  underwater: false,
  spacing: 48,
  build: () => {
    const parts: Array<[number, number, number, string]> = [];
    const w = 4, d = 4, h = 3;
    for (let x = 0; x < w; x++)
      for (let z = 0; z < d; z++)
        for (let y = 0; y < h; y++) {
          const edge = x === 0 || x === w - 1 || z === 0 || z === d - 1;
          if (edge) parts.push([x, y, z, "cloud"]);
        }
    // Roof
    for (let x = 0; x < w; x++)
      for (let z = 0; z < d; z++) parts.push([x, h, z, Math.random() < 0.8 ? "cloud" : "planks" ]);
    // Door hole
    parts.push([1, 0, 0, "sand"]); // dummy — overwritten to air below
    return parts.filter(p => !(p[0] === 1 && p[1] === 0 && p[2] === 0) && !(p[0] === 1 && p[1] === 1 && p[2] === 0));
  },
});
registerStructure({
  name: "great_oak_tree",
  rarity: 40,
  underwater: false,
  minHeight: 31,
  build: (x, y, z) => {
    const parts: Array<[number, number, number, string]> = [];
    const h = 4 + Math.floor(Math.random() * 2);
    for (let i = 0; i < h; i++) parts.push([0, i, 0, "wood"]);
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++)
        for (let dy = 0; dy < 2; dy++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          parts.push([dx, h - 1 + dy, dz, "leaves"]);
        }
    parts.push([0, h + 1, 0, "leaves"]);
    return parts;
  },
});
registerDimension({
  name: "end",
  displayName: "End",
  seedOffset: 8191,
  skyColor: 0xa1509e,
  gravity: 0.025,
  liquidBlock: null,
  surfaceBlock: "cloud",
  fillerBlock: "cloud",
  stoneBlock: "cloud",
  // Only what is listed here spawns; leaving a list out means "none at all".
  structures: ["boulder",'end_hut','great_oak_tree'],
  mobs: ["rabbit", "sheep", "fireman",'pig'],
  music: "dim_skylands",

  heightAt: (_x, _z, base) => base + 18,
  blockAt: (x, y, z, height, fallback) => {
    // Floating islands: keep a slab of terrain, carve everything else away.
    if (y > height || y < height - 6) return null;
    const wobble = Math.sin(x * 0.19) + Math.cos(z * 0.21);
    if (wobble < -1.1) return null;
    if (y === height) return "cloud";
    if (y > height - 3) return "cloud";
    return "cloud";
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
  liquidBlock : "lava",
  music: 'caves',
  seaLevel:30,
  heightAt: (_x, _z, base) => base + 14,
  mobs: ["fireman",'pig','cow','sheep']
});
registerCommand({
  name: "add-dim",
  description: "Add new dimension",
  usage: "add-dim <name> <args: json>",
  run: (c) => {
    const name = c.args[0];
    let data = JSON.parse(c.args[1]) as any;
    const main={
      skyColor: 0x00ffff,
      seedOffset: 63,
      gravity: 1.0,
      structures: ['hut','great_oak_tree'],
      surfaceBlock: "grass",
      fillerBlock: "dirt",
      stoneBlock: "stone",
      liquidBlock: null,
      seaLevel: 14,
      music: 'day',
      mobs: ['rabbit','pig','cow','sheep']
    }
    const merged = { ...main, ...data };
    merged['name']=name;
    merged['displayName']=name;
    registerDimension(merged);
    runCommand(`/dimension ${name}`);
    runCommand(`/heal`);
  },
  "aliases":["add-dimension",'add_dim','add_dimension'],
});
let isNew = true;
if ( isNew ) {
  runCommand('/tp -50 36 -150');
  runCommand('/heal');
};
isNew = false;
