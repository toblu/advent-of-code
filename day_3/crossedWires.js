const fs = require("fs");
const path = require("path");
const { inRange, range, intersection, findIndex } = require("lodash");

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

const generateLine = (x, y, accSteps, path) => {
  const [direction, ...steps] = path;
  const noOfSteps = +steps.join("");

  if (xDirections.includes(direction)) {
    // Horizontal line (x-direction)
    return {
      x: isNegativeDirection(direction)
        ? [x, x - noOfSteps]
        : [x, x + noOfSteps],
      y,
      accSteps: noOfSteps + accSteps
    };
  }
  // Vertical line (y-direction)
  return {
    x,
    y: isNegativeDirection(direction) ? [y, y - noOfSteps] : [y, y + noOfSteps],
    accSteps: noOfSteps + accSteps
  };
};

// Generate lines with start and end coordinates based on paths ('R25', 'U14', 'L3', 'D76' etc.)
const generateLines = (start, paths) => {
  const lines = [start];
  paths.forEach(path => {
    // End coordinates of previous line
    const { x, y, accSteps } = lines.slice(-1)[0];
    lines.push(
      generateLine(
        x.length ? x.slice(-1)[0] : x,
        y.length ? y.slice(-1)[0] : y,
        accSteps,
        path
      )
    );
  });
  return lines;
};

const findPerpendicularIntersections = (ref, comp) => {
  if (isHorizontal(ref)) {
    // Ref line is horizontal, find intersections with vertical lines
    return comp
      .filter(
        line =>
          (inRange(line.x, ...ref.x) || ref.x[1] === line.x) &&
          (inRange(ref.y, ...line.y) || line.y[1] === ref.y)
      )
      .map(line => [line.x, ref.y]);
  } else if (isVertical(ref)) {
    // Ref line is vertical, find intersections with horizontal lines
    return comp
      .filter(
        line =>
          (inRange(ref.x, ...line.x) || line.x[1] === ref.x) &&
          (inRange(line.y, ...ref.y) || ref.y[1] === line.y)
      )
      .map(line => [ref.x, line.y]);
  }
  return [];
};

const findParallelOverlaps = (ref, comp) => {
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
      // Do not count starting point as intersection
      return commonX
        .filter(x => !(x === 0 && ref.y === 0))
        .map(x => [x, ref.y]);
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
      // Do not count starting point as intersection
      return commonY
        .filter(y => !(y === 0 && ref.x === 0))
        .map(y => [ref.x, y]);
    }
  }
  return [];
};

const findAllIntersectionPoints = (wire1, wire2) => {
  const intersections = [];
  wire1.horizontal.forEach(line => {
    intersections.push(
      ...findPerpendicularIntersections(line, wire2.vertical),
      ...findParallelOverlaps(line, wire2.horizontal)
    );
  });
  wire1.vertical.forEach(line => {
    intersections.push(
      ...findPerpendicularIntersections(line, wire2.horizontal),
      ...findParallelOverlaps(line, wire2.vertical)
    );
  });
  return intersections;
};

const getFewestStepsToIntersection = (
  intersections,
  wire1Lines,
  wire2Lines
) => {
  const isXYOnLine = (x, y) => line =>
    line.x.length
      ? y === line.y && (inRange(x, ...line.x) || line.x[1] === x)
      : x === line.x && (inRange(y, ...line.y) || line.y[1] === y);

  const stepsFromEndOfLine = (line, x, y) =>
    line.x.length ? Math.abs(line.x[1] - x) : Math.abs(line.y[1] - y);
  // TODO: Find first index of lines including intersection points
  return intersections.reduce((minSteps, [x, y]) => {
    const lineIncludesXY = isXYOnLine(x, y);
    const wire1FirstCrossingIndex = findIndex(wire1Lines, lineIncludesXY);
    const wire2FirstCrossingIndex = findIndex(wire2Lines, lineIncludesXY);

    const steps =
      wire1Lines[wire1FirstCrossingIndex].accSteps -
      stepsFromEndOfLine(wire1Lines[wire1FirstCrossingIndex], x, y) +
      wire2Lines[wire2FirstCrossingIndex].accSteps -
      stepsFromEndOfLine(wire2Lines[wire2FirstCrossingIndex], x, y);
    if (minSteps > 0) return Math.min(minSteps, steps);

    return steps;
  });
};

const centerPos = {
  x: 0,
  y: 0,
  accSteps: 0
};

let wire1Lines = generateLines(centerPos, wire1Path);
wire1Lines = {
  ordered: wire1Lines,
  horizontal: wire1Lines.filter(isHorizontal),
  vertical: wire1Lines.filter(isVertical)
};

let wire2Lines = generateLines(centerPos, wire2Path);
wire2Lines = {
  ordered: wire2Lines,
  horizontal: wire2Lines.filter(isHorizontal),
  vertical: wire2Lines.filter(isVertical)
};

const intersections = findAllIntersectionPoints(wire1Lines, wire2Lines);

/**
 * Part 1
 */
const closestCrossingDistance = Math.min(
  ...intersections.map(([x, y]) => Math.abs(x) + Math.abs(y))
);

console.log(
  "Manhattan distance to closest intersection:",
  closestCrossingDistance
);
/**
 * END
 */

/**
 * Part 2
 */
const fewestSteps = getFewestStepsToIntersection(
  intersections,
  wire1Lines.ordered,
  wire2Lines.ordered
);

console.log("Fewest steps to intersection:", fewestSteps);
/**
 * END
 */
