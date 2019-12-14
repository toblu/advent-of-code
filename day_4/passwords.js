const readFileInput = require("../helpers/readFileInput");

const { range } = require("lodash");

let [rangeStart, rangeEnd] = readFileInput(process.argv[2]).split("-");
rangeStart = parseInt(rangeStart, 10);
rangeEnd = parseInt(rangeEnd, 10);

const length = pwd => pwd.length === 6;

const adjacentNumbers = pwd =>
  [...pwd].reduce(
    (hasSameAdjacent, number, index) =>
      hasSameAdjacent || (index !== 0 && number === pwd[index - 1]),
    false
  );

const adjacentNumberGroup = pwd =>
  [...pwd].reduce((hasSameAdjacentTwoGroup, number, index) => {
    if (hasSameAdjacentTwoGroup) return true;
    if (index === 0)
      return number === pwd[index + 1] && number !== pwd[index + 2];
    if (index >= 1 && index <= 3)
      return (
        number === pwd[index + 1] &&
        number !== pwd[index - 1] &&
        number !== pwd[index + 2]
      );
    if (index === 4)
      return number === pwd[index + 1] && number !== pwd[index - 1];
    return false;
  }, false);

const noDecreasingNumber = pwd =>
  [...pwd].reduce(
    (noDecrease, number, index) =>
      index === 0 ||
      (noDecrease && parseInt(number, 10) >= parseInt(pwd[index - 1], 10)),
    true
  );

const isValidPassword = rules => pwd =>
  rules.reduce((isValid, validateRule) => isValid && validateRule(pwd), true);

/**
 * Part 1
 */
console.log("------- Part 1 -------");
const rulesPart1 = [length, adjacentNumbers, noDecreasingNumber];
console.log(
  "Number of passwords in range that meet the criteria:",
  range(rangeStart, rangeEnd + 1)
    .map(number => number.toString())
    .filter(isValidPassword(rulesPart1)).length
);
console.log("------- Part 1 end-------");

console.log("\n");

/**
 * Part 2
 */
console.log("------- Part 2 -------");
const rulesPart2 = [length, adjacentNumberGroup, noDecreasingNumber];
console.log(
  "Number of passwords in range that meet the criteria:",
  range(rangeStart, rangeEnd + 1)
    .map(number => number.toString())
    .filter(isValidPassword(rulesPart2)).length
);
console.log("------- Part 2 end-------");
