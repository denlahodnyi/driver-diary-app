import { random } from 'lodash';

const colorsCache = new Map();

const randomRgb = (index: number): string => {
  if (colorsCache.has(index)) {
    return colorsCache.get(index);
  }
  const randomZeroIdx = random(0, 2, false);
  let max: number;
  const rgbColors = [0, 0, 0].map((_, i) => {
    if (i === randomZeroIdx) return 0;
    max = random(max >= 0 && max < 150 ? 150 : 0, 255, false);
    return max;
  });
  const color = `rgb(${rgbColors.join(', ')})`;

  colorsCache.set(index, color);

  return color;
};

export default randomRgb;
