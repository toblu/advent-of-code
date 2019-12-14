const readFileInput = require("../helpers/readFileInput");

const generateIntCodeComputer = require("../helpers/generateIntCodeComputer");
const intCodeComputer = generateIntCodeComputer();

const calculateResult = (input, address_1, address_2) => {
  const codes = [...input];
  codes[1] = address_1 != null ? address_1 : input[1];
  codes[2] = address_2 != null ? address_2 : input[2];

  const result = intCodeComputer.run(codes);
  return result[0];
};

if (process.argv.length < 3) {
  console.log("Missing path to input file");
  process.exit(1);
}

const inputFile = readFileInput(process.argv[2])
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
for (const pos_1 of range0to99) {
  for (const pos_2 of range0to99) {
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
  }
}

console.log("Could not find correct inputs");
process.exit(1);

/**
 * ---------- Part 2 end -------
 */
