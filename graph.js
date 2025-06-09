import { FONT } from "./font.js";

const WIDTH = 53;
const HEIGHT = 7;

export function createGrid(text) {
  const grid = Array.from({ length: WIDTH }, () => Array(HEIGHT).fill(0));

  // Calculate text width
  let textWidth = 0;
  for (const char of text.toUpperCase()) {
    if (char === " ") {
      textWidth += 5;
    } else {
      const bitmap = FONT[char];
      if (bitmap) textWidth += bitmap.length + 3; // letter width + spacing
    }
  }

  // Center text horizontally
  let startX = Math.floor((WIDTH - textWidth) / 2);

  for (const char of text.toUpperCase()) {
    if (char === " ") {
      startX += 5;
      continue;
    }

    const bitmap = FONT[char];
    if (!bitmap) continue;

    for (let dx = 0; dx < bitmap.length; dx++) {
      for (let dy = 0; dy < bitmap[0].length; dy++) {
        if (bitmap[dx][dy]) {
          const x = startX + dx;
          const y = 1 + dy;
          if (x < WIDTH && y < HEIGHT) {
            grid[x][y] = 4; // brightest level for text
          }
        }
      }
    }

    startX += bitmap.length + 3; // space between characters
  }

  return grid;
}

export function applyGradient(grid, radius = 2) {
  const newGrid = grid.map(row => row.slice());

  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      if (grid[x][y] === 4) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const dist = Math.abs(dx) + Math.abs(dy);
            if (dist === 0 || dist > radius) continue;

            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < WIDTH && ny < HEIGHT) {
              newGrid[nx][ny] = Math.max(newGrid[nx][ny], 4 - dist);
            }
          }
        }
      }
    }
  }

  return newGrid;
}

export function fillBackground(grid) {
  const center = WIDTH / 2;

  for (let x = 0; x < WIDTH; x++) {
    const maxLevel = Math.max(1, 3 - Math.floor(Math.abs(center - x) / 10)); // fades near edges
    for (let y = 0; y < HEIGHT; y++) {
      if (grid[x][y] === 0 && Math.random() < 0.6) {
        grid[x][y] = Math.floor(Math.random() * (maxLevel + 1));
      }
    }
  }
}

export function addStars(grid, count = 10) {
  let added = 0;
  while (added < count) {
    const x = Math.floor(Math.random() * WIDTH);
    const y = Math.floor(Math.random() * HEIGHT);
    if (grid[x][y] === 0) {
      grid[x][y] = 2; // mid-tone dot
      added++;
    }
  }
}
