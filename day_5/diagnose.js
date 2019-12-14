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

const additionalInstructions = {
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
  }
};

const intCodeComputer = generateIntCodeComputer(additionalInstructions);

intCodeComputer.run(codes);
