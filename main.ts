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
registerDimension({
  name: "nether",
  displayName: "Nether",
  skyColor: 0xc94908,
  gravity: 0.5,
  nostructures:true,
  surfaceBlock: "deathgrass",
  fillerBlock: "deathsoil",
  stoneBlock: "deathstone"
});
