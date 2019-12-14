const generateIntCodeComputer = (additionalOperations = {}) => {
  const operations = {
    1: (instructions, index) => {
      const newInstructions = [...instructions];
      const [readPos1, readPos2, writePos] = instructions.slice(
        index + 1,
        index + 4
      );
      newInstructions[writePos] =
        instructions[readPos1] + instructions[readPos2];
      return [newInstructions, index + 4];
    },
    2: (instructions, index) => {
      const newInstructions = [...instructions];
      const [readPos1, readPos2, writePos] = instructions.slice(
        index + 1,
        index + 4
      );
      newInstructions[writePos] =
        instructions[readPos1] * instructions[readPos2];
      return [newInstructions, index + 4];
    },
    ...additionalOperations
  };

  const doOp = (instructions, index) => {
    const opCode = instructions[index];
    if (typeof operations[opCode] === "function")
      return operations[opCode](instructions, index);
    throw new Error("Unexpected Opcode: ", opCode);
  };

  const run = originalInstructions => {
    let index = 0;
    let resultInstructions = [...originalInstructions];

    while (
      index < resultInstructions.length &&
      resultInstructions[index] !== 99
    ) {
      [resultInstructions, index] = doOp(resultInstructions, index);
    }

    return resultInstructions;
  };

  return {
    run
  };
};

module.exports = generateIntCodeComputer;
