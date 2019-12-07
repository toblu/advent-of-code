const fs = require("fs");
const path = require("path");
const { inRange, range, intersection } = require("lodash");

const inputFilePath = path.resolve(__dirname, process.argv[2] || "wires.txt");

let [wire1Path, wire2Path] = fs.readFileSync(inputFilePath, "utf8").split("\n");

wire1Path = wire1Path.split(",");
wire2Path = wire2Path.split(",");

const isVertical = line => !line.x.length && line.y.length > 1;
const isHorizontal = line => line.x.length > 1 && !line.y.length;
const xDirections = ["R", "L"]; // [positive direction, negative direction]
const yDirections = ["U", "D"];
const isNegativeDirection = direction =>
  [xDirections[1], yDirections[1]].includes(direction);

const generateLine = (x, y, path) => {
  const [direction, ...steps] = path;
  const noOfSteps = +steps.join("");

  if (xDirections.includes(direction)) {
    // Horizontal line (x-direction)
    return {
      x: isNegativeDirection(direction)
        ? [x, x - noOfSteps]
        : [x, x + noOfSteps],
      y
    };
  }
  // Vertical line (y-direction)
  return {
    x,
    y: isNegativeDirection(direction) ? [y, y - noOfSteps] : [y, y + noOfSteps]
  };
};

// Generate lines with start and end coordinates based on paths ('R25', 'U14', 'L3', 'D76' etc.)
const generateLines = (start, paths) => {
  const lines = [start];
  paths.forEach(path => {
    // End coordinates of previous line
    const { x, y } = lines.slice(-1)[0];
    lines.push(
      generateLine(
        x.length ? x.slice(-1)[0] : x,
        y.length ? y.slice(-1)[0] : y,
        path
      )
    );
  });
  return lines;
};

const findClosestPerpendicularIntersection = (ref, comp) => {
  const intersections = [];
  if (isHorizontal(ref)) {
    // Ref line is horizontal, find intersections with vertical lines
    const xIntersections = comp
      .filter(
        line =>
          (inRange(line.x, ...ref.x) || ref.x[1] === line.x) &&
          (inRange(ref.y, ...line.y) || line.y[1] === ref.y)
      )
      .map(line => line.x);
    if (xIntersections.length) {
      intersections.push([Math.min(...xIntersections.map(Math.abs)), ref.y]);
    }
  } else if (isVertical(ref)) {
    // Ref line is vertical, find intersections with horizontal lines
    const yIntersections = comp
      .filter(
        line =>
          (inRange(ref.x, ...line.x) || line.x[1] === ref.x) &&
          (inRange(line.y, ...ref.y) || ref.y[1] === line.y)
      )
      .map(line => line.y);
    if (yIntersections.length) {
      intersections.push([ref.x, Math.min(...yIntersections.map(Math.abs))]);
    }
  }
  return intersections;
};

const findClosestParallelOverlaps = (ref, comp) => {
  const overlaps = [];
  if (isHorizontal(ref)) {
    // Ref line is horizontal, find overlaps with other horizontal lines
    const xOverlaps = comp
      .filter(
        line =>
          line.y === ref.y &&
          (inRange(line.x[0], ...ref.x) ||
            inRange(line.x[1], ...ref.x) ||
            line.x[1] === ref.x[1])
      )
      .map(line => range(...line.x));

    if (xOverlaps.length) {
      const refRange = range(...ref.x);
      const commonX = intersection(refRange, ...xOverlaps);
      const minCommonX = Math.min(...commonX.map(Math.abs));
      // Do not count starting point as intersection
      !(minCommonX === 0 && ref.y === 0) && overlaps.push([minCommonX, ref.y]);
    }
  } else if (isVertical(ref)) {
    // Ref line is vertical, find overlaps with other vertical lines
    const yOverlaps = comp
      .filter(
        line =>
          line.x === ref.x &&
          (inRange(line.y[0], ...ref[y]) ||
            inRange(line.y[1], ...ref.y) ||
            line.y[1] === ref.y[1])
      )
      .map(line => range(...line.y));

    if (yOverlaps.length) {
      const refRange = range(...ref.y);
      const commonY = intersection(refRange, ...yOverlaps);
      const minCommonY = Math.min(...commonY.map(Math.abs));
      // Do not count starting point as intersection
      !(minCommonY === 0 && ref.x === 0) && overlaps.push([ref.x, minCommonY]);
    }
  }
  return overlaps;
};

const findClosestIntersectionDistance = (wire1, wire2) => {
  const intersections = [];
  wire1.horizontal.forEach(line => {
    intersections.push(
      ...findClosestPerpendicularIntersection(line, wire2.vertical),
      ...findClosestParallelOverlaps(line, wire2.horizontal)
    );
  });
  wire1.vertical.forEach(line => {
    intersections.push(
      ...findClosestPerpendicularIntersection(line, wire2.horizontal),
      ...findClosestParallelOverlaps(line, wire2.vertical)
    );
  });
  return Math.min(...intersections.map(([x, y]) => Math.abs(x) + Math.abs(y)));
};

const centerPos = {
  x: 0,
  y: 0
};

let wire1Lines = generateLines(centerPos, wire1Path);
wire1Lines = {
  horizontal: wire1Lines.filter(isHorizontal),
  vertical: wire1Lines.filter(isVertical)
};

let wire2Lines = generateLines(centerPos, wire2Path);
wire2Lines = {
  horizontal: wire2Lines.filter(isHorizontal),
  vertical: wire2Lines.filter(isVertical)
};

const closestCrossingDistance = findClosestIntersectionDistance(
  wire1Lines,
  wire2Lines
);

console.log(
  "Manhattan distance to closest intersection:",
  closestCrossingDistance
);
