import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import { createGrid, applyGradient, fillBackground, addStars } from "./graph.js";



const path = "./data.json";
const git = simpleGit();
const grid = createGrid("NEW AGE DESIGN TZ");
applyGradient(grid);
fillBackground(grid); // <— NEW
addStars(grid, 20);

const dates = [];

const startDate = moment().startOf("day").subtract((364), "days");

for (let dayIndex = 0; dayIndex < (365); dayIndex++) {
  const current = moment(startDate).add(dayIndex, "days");
  const week = Math.floor(dayIndex / 7);
  const day = dayIndex % 7;
  const intensity = grid[week][day];

  for (let i = 0; i < intensity; i++) {
    const date = moment(current).add(i, "minutes").toISOString();
    dates.push(date);
  }
}


const commitAt = async (date) => {
  const data = {
  date,
  nonce: Math.random().toString(36).substring(2, 8),
};

  await jsonfile.writeFile(path, data);
  await git.add([path]);
  await git.commit(`commit on ${date}`, undefined, { "--date": date });
};

const run = async () => {
  for (const date of dates) {
    await commitAt(date);
  }
  await git.push();
};

run();

