const readFileInput = require("../helpers/readFileInput");
const TreeNode = require("./TreeNode");

const orbits = readFileInput(process.argv[2]).split("\n");

const findOrbitingObjects = object =>
  orbits
    .filter(orbit => orbit.startsWith(`${object})`))
    .map(orbit => orbit.replace(`${object})`, ""));

const addOrbitingObjects = node => {
  findOrbitingObjects(node.name)
    .map(name => new TreeNode({ name, parent: node, lvl: node.lvl + 1 }))
    .forEach(descendent => {
      node.descendents.push(descendent);
      addOrbitingObjects(descendent);
    });
};

const countNoOfOrbits = node =>
  node.lvl +
  node.descendents.reduce(
    (total, descendent) => total + countNoOfOrbits(descendent),
    0
  );

const rootNode = new TreeNode({ name: "COM", parent: null, lvl: 0 });

addOrbitingObjects(rootNode);

const totalNoOfOrbits = countNoOfOrbits(rootNode);
console.log("Total number of orbits:", totalNoOfOrbits);
