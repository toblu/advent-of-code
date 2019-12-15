const getParamValues = (paramModes, instructions) => params =>
  params.map((p, i) => (paramModes[i] === 1 ? p : instructions[p]));

const generateIntCodeComputer = (additionalOperations = {}) => {
  const operations = {
    1: (instructions, index, getParams) => {
      const newInstructions = [...instructions];
      const [p1, p2, r] = instructions.slice(index + 1, index + 4);
      const params = getParams([p1, p2]);

      newInstructions[r] = params[0] + params[1];
      return [newInstructions, index + 4];
    },
    2: (instructions, index, getParams) => {
      const newInstructions = [...instructions];
      const [p1, p2, r] = instructions.slice(index + 1, index + 4);
      const params = getParams([p1, p2]);

      newInstructions[r] = params[0] * params[1];
      return [newInstructions, index + 4];
    },
    ...additionalOperations
  };

  function* performOperationsGen(inst, i) {
    let index = i;
    let instructions = [...inst];

    while (index < instructions.length && instructions[index] !== 99) {
      const opCode = instructions[index] % 100;
      const paramModes =
        instructions[index] >= 100
          ? [...instructions[index].toString()]
              .map(mode => +mode)
              .reverse()
              .filter((_, i) => i !== 0 && i !== 1)
          : [];
      if (typeof operations[opCode] === "function") {
        [instructions, index] = yield operations[opCode](
          instructions,
          index,
          getParamValues(paramModes, instructions)
        );
      } else {
        throw new Error(`Unexpected Opcode: ${opCode}`);
      }
    }
    return [instructions, index];
  }

  const run = (originalInstructions, cb) => {
    const operationsGenerator = performOperationsGen(originalInstructions, 0);
    const runNextOp = (instructions, index) => {
      const { value, done } = operationsGenerator.next([instructions, index]);
      if (done) {
        if (cb && typeof cb === "function") {
          cb(value ? value[0] : undefined);
        }
        return;
      }
      if (value.then) {
        value.then(resolvedValue => runNextOp(...resolvedValue));
      } else {
        runNextOp(...value);
      }
    };
    return runNextOp();
  };
  return {
    run
  };
};

module.exports = generateIntCodeComputer;
