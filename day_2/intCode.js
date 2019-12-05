const fs = require("fs");
const path = require("path");

const getInput = filePath => {
  const input = fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
  return input.split(",").map(value => +value);
};

if (process.argv.length < 3) {
  console.log("Missing path to input file");
  process.exit(1);
}
const inputFile = process.argv[2];

const getOpResult = (opCode, a, b) => {
  if (opCode === 1) return a + b;
  if (opCode === 2) return a * b;
  throw new Error("Unexpected Opcode: ", opCode);
};

const codes = getInput(path.resolve(__dirname, inputFile));

let i = 0;
while (codes[i] !== 99) {
  const [opCode, pos1, pos2, resPos] = codes.slice(i, i + 4);
  codes[resPos] = getOpResult(opCode, codes[pos1], codes[pos2]);
  i = i + 4;
}

console.log("Result:", codes);
