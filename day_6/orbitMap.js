const readFileInput = require("../helpers/readFileInput");
const TreeNode = require("./TreeNode");
const { findIndex } = require("lodash");

let YOU;
let SAN;

const orbits = readFileInput(process.argv[2]).split("\n");

const findOrbitingObjects = object =>
  orbits
    .filter(orbit => orbit.startsWith(`${object})`))
    .map(orbit => orbit.replace(`${object})`, ""));

const addOrbitingObjects = node => {
  findOrbitingObjects(node.name)
    .map(name => {
      const childNode = new TreeNode({ name, parent: node, lvl: node.lvl + 1 });
      if (name === "YOU") {
        YOU = childNode;
      } else if (name === "SAN") {
        SAN = childNode;
      }
      return childNode;
    })
    .forEach(descendent => {
      node.descendents.push(descendent);
      addOrbitingObjects(descendent);
    });
};

const getParents = node => {
  if (node.parent) {
    return [node.parent, ...getParents(node.parent)];
  } else {
    return [];
  }
};

const closestCommonParent = (node1, node2) => {
  const node1Parents = getParents(node1);
  const node2Parents = getParents(node2);
  if (node2Parents.includes(node1)) return node1;
  if (node1Parents.includes(node2)) return node2;
  const closestCommonParentIndex = findIndex(node1Parents, node =>
    node2Parents.includes(node)
  );
  return node1Parents[closestCommonParentIndex];
};

const countNoOfOrbits = node =>
  node.lvl +
  node.descendents.reduce(
    (total, descendent) => total + countNoOfOrbits(descendent),
    0
  );

const rootNode = new TreeNode({ name: "COM", parent: null, lvl: 0 });

addOrbitingObjects(rootNode);

console.log("\n----------- Part 1 -------------\n");
const totalNoOfOrbits = countNoOfOrbits(rootNode);
console.log("Total number of orbits:", totalNoOfOrbits);
console.log("\n----------- Part 1 end -------------\n");

console.log("\n----------- Part 2 -------------\n");
const commonParent = closestCommonParent(YOU, SAN);
const minimalTransfers =
  YOU.lvl - commonParent.lvl - 1 + SAN.lvl - commonParent.lvl - 1;
console.log("Minimum orbital transfers from YOU to SAN:", minimalTransfers);
console.log("\n----------- Part 2 end -------------\n");
