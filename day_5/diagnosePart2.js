const readFileInput = require("../helpers/readFileInput");
const generateIntCodeComputer = require("../helpers/generateIntCodeComputer");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const codes = readFileInput(process.argv[2])
  .split(",")
  .map(value => +value);

/**
 * ----------- Part 2 -------------
 */

const additionalInstructionsPart2 = {
  3: (instructions, index) =>
    new Promise(resolve => {
      const newInstructions = [...instructions];
      const [r] = instructions.slice(index + 1, index + 2);
      rl.question("Input: ", input => {
        newInstructions[r] = +input;
        resolve([newInstructions, index + 2]);
        rl.close();
      });
    }),
  4: (instructions, index, getParams) => {
    const [param] = getParams(instructions.slice(index + 1, index + 2));
    console.log("Output:", param);
    return [instructions, index + 2];
  },
  5: (instructions, index, getParams) => {
    const [p1, p2] = getParams(instructions.slice(index + 1, index + 3));
    if (p1 !== 0) return [instructions, p2];
    return [instructions, index + 3];
  },
  6: (instructions, index, getParams) => {
    const [p1, p2] = getParams(instructions.slice(index + 1, index + 3));
    if (p1 === 0) return [instructions, p2];
    return [instructions, index + 3];
  },
  7: (instructions, index, getParams) => {
    const newInstructions = [...instructions];
    const [p1, p2] = getParams(instructions.slice(index + 1, index + 3));
    const r = newInstructions[index + 3];
    newInstructions[r] = p1 < p2 ? 1 : 0;
    return [newInstructions, index + 4];
  },
  8: (instructions, index, getParams) => {
    const newInstructions = [...instructions];
    const [p1, p2] = getParams(instructions.slice(index + 1, index + 3));
    const r = newInstructions[index + 3];
    newInstructions[r] = p1 === p2 ? 1 : 0;
    return [newInstructions, index + 4];
  }
};

const intCodeComputerPart2 = generateIntCodeComputer(
  additionalInstructionsPart2
);

intCodeComputerPart2.run(codes);

/**
 * ----------- Part 2 end-------------
 */
