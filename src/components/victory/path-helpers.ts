// import pathHelpers from 'victory-core/src/victory-primitives/path-helpers';

// Todo: Move this functionality to PF4 react-charts package
export default {
  // Todo: Our jest config fails to process the import in path-helpers
  // ...pathHelpers,
  dash(x, y, size) {
    const baseSize = 1.1 * size;
    const lineHeight = baseSize - baseSize * 0.3;
    const x0 = x - baseSize;
    const y1 = y + lineHeight / 2;
    const distance = (x + baseSize - x0) * 0.3;
    const padding = distance / 3;
    return `M ${x0}, ${y1}
      h${distance}
      v-${lineHeight}
      h-${distance}
      z
      M ${x0 + distance + padding}, ${y1}
      h${distance}
      v-${lineHeight}
      h-${distance}
      z
      M ${x0 + distance * 2 + padding * 2}, ${y1}
      h${distance}
      v-${lineHeight}
      h-${distance}
      z`;
  },

  minus(x, y, size) {
    const baseSize = 1.1 * size;
    const lineHeight = baseSize - baseSize * 0.3;
    const x0 = x - baseSize;
    const y1 = y + lineHeight / 2;
    const distance = x + baseSize - x0;
    return `M ${x0}, ${y1}
      h${distance}
      v-${lineHeight}
      h-${distance}
      z`;
  },
};
