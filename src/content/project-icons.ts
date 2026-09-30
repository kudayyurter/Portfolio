import type { Bitmap } from "@/lib/pixel-font";

/** Hand-drawn 1-bit icons for the personal projects, drawn at 3px per pixel. */

/** A planet inside its orbit, with a satellite riding the ring. */
export const orbit: Bitmap = [
  "000011110000",
  "001100000110",
  "010000000110",
  "010000000010",
  "100001100001",
  "100011110001",
  "100011110001",
  "100001100001",
  "010000000010",
  "010000000010",
  "001100001100",
  "000011110000",
];

/** A terminal window split into two panes, each with a prompt. */
export const tiledTerminals: Bitmap = [
  "11111111111",
  "11111111111",
  "10000100001",
  "10100101001",
  "10010100101",
  "10100101001",
  "10000100001",
  "10110101101",
  "10000100001",
  "11111111111",
];

/** A segmented snake, as in the arcade game, heading for a food pellet. */
export const snake: Bitmap = [
  "111011101110000",
  "111011101110000",
  "111011101110000",
  "000000000000000",
  "111000000000000",
  "111000000000000",
  "111000000000000",
  "000000000000000",
  "111011101110000",
  "111011101110010",
  "111011101110000",
];

/** An upright sword: outlined blade, crossguard, grip, and pommel. */
export const sword: Bitmap = [
  "0001000",
  "0010100",
  "0010100",
  "0010100",
  "0010100",
  "0010100",
  "0010100",
  "0010100",
  "1111111",
  "0001000",
  "0001000",
  "0011100",
];

/** A boot screen: a ring logo over a loading bar. */
export const bootScreen: Bitmap = [
  "111111111111",
  "100000000001",
  "100001100001",
  "100010010001",
  "100001100001",
  "100000000001",
  "101111111101",
  "101110000101",
  "101111111101",
  "100000000001",
  "111111111111",
];
