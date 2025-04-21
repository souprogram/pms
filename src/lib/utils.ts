import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAt = <T>(array: T[], index: number): T => {
  const item = array[index];
  if (!item) {
    throw new Error(
      `Item of index ${index} not found in array of length ${array.length}`,
    );
  }

  return item;
};

export const chunkArray = <T>(
  array: T[],
  chunkSize: number | (() => number),
): T[][] => {
  const chunks: T[][] = [];
  let i = 0;

  while (i < array.length) {
    const chunkSizeValue =
      typeof chunkSize === "function" ? chunkSize() : chunkSize;

    chunks.push(array.slice(i, i + chunkSizeValue));

    i += chunkSizeValue;
  }

  return chunks;
};

export const chunkArrayWithMin = <T>(
  array: T[],
  chunkSize: number | (() => number),
  minSize: number | (() => number),
): T[][] => {
  const chunks = chunkArray(array, chunkSize);
  const minSizeValue = typeof minSize === "function" ? minSize() : minSize;

  if (chunks.length > 1) {
    const lastChunk = chunks[chunks.length - 1]!;
    const prevChunk = chunks[chunks.length - 2]!;

    if (lastChunk.length < minSizeValue) {
      if (prevChunk.length > minSizeValue) {
        // Move last element from prevChunk to the start of lastChunk
        lastChunk.unshift(prevChunk.pop()!);
      } else {
        // Merge last chunk with the previous one
        chunks[chunks.length - 2] = prevChunk.concat(lastChunk);
        chunks.pop();
      }
    }
  }

  return chunks;
};

export const pickRandom = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex]!;
};
