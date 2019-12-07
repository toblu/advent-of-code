const fs = require("fs");
const path = require("path");

const getOpResult = (opCode, a, b) => {
  if (opCode === 1) return a + b;
  if (opCode === 2) return a * b;
  throw new Error("Unexpected Opcode: ", opCode);
};

const calculateResult = (input, address_1, address_2) => {
  const codes = [...input];
  codes[1] = address_1 != null ? address_1 : input[1];
  codes[2] = address_2 != null ? address_2 : input[2];

  let i = 0;
  while (codes[i] !== 99) {
    const [opCode, param1, param2, resPos] = codes.slice(i, i + 4);
    codes[resPos] = getOpResult(opCode, codes[param1], codes[param2]);
    i = i + 4;
  }
  return codes[0];
};

if (process.argv.length < 3) {
  console.log("Missing path to input file");
  process.exit(1);
}

const inputFilePath = path.resolve(__dirname, process.argv[2]);
const inputFile = fs
  .readFileSync(inputFilePath, "utf8")
  .split(",")
  .map(value => +value);

/**
 * ---------- Part 1 -----------
 * */

console.log("---------- Part 1 ----------");
console.log(
  "Result:",
  calculateResult(inputFile, +process.argv[3], +process.argv[4])
);
console.log("Part 1 done!");
console.log("----------------------------\n");

/**
 * ---------- Part 1 end -------
 */

/**
 * ---------- Part 2 -----------
 * */

console.log("---------- Part 2 ----------");
const TARGET = 19690720;
console.log("Target is:", TARGET);

const range0to99 = [...Array(100).keys()];

console.log("Calculating...");
range0to99.forEach(pos_1 => {
  range0to99.forEach(pos_2 => {
    try {
      const result = calculateResult(inputFile, pos_1, pos_2);
      if (result === TARGET) {
        console.log("noun:", pos_1);
        console.log("verb", pos_2);
        console.log("Result:", 100 * pos_1 + pos_2);
        console.log("Part 2 done!");
        return;
      }
    } catch (e) {
      // Do nothing, continue searching
    }
  });
});

console.log("Could not find correct inputs");
process.exit(1);

/**
 * ---------- Part 2 end -------
 */
