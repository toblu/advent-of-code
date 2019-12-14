const fs = require("fs");
const path = require("path");

const readFileInput = file => {
  const filePath = path.resolve(process.cwd(), file);
  return fs.readFileSync(filePath, "utf8");
};

module.exports = readFileInput;
