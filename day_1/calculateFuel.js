const fs = require("fs");
const path = require("path");

// Get fuel required for a specific mass
const getFuelConsumptionByMass = mass => {
  const fuelConsumption = Math.floor(mass / 3) - 2;
  return fuelConsumption > 0 ? fuelConsumption : 0;
};

// Get fuel consumption considering the additional weight of the fuel to the module
const calculateFuelConsumption = fuelMass => {
  const additionalFuel = getFuelConsumptionByMass(fuelMass);
  if (additionalFuel > 0)
    return fuelMass + calculateFuelConsumption(additionalFuel);
  return fuelMass;
};

const getModuleMasses = filePath => {
  const input = fs.readFileSync(path.resolve(__dirname, filePath), "utf8");
  return input.split("\n").map(value => +value);
};

if (process.argv.length < 3) {
  console.log("Missing path to input file");
  process.exit(1);
}
const inputFile = process.argv[2];

const totalFuelConsumption = getModuleMasses(inputFile).reduce(
  (total, moduleMass) =>
    total + calculateFuelConsumption(getFuelConsumptionByMass(moduleMass)),
  0
);

console.log("Total fuel consumption is:", totalFuelConsumption);
