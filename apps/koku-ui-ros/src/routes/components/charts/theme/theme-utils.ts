import { ChartThemeColor, getCustomTheme } from '@patternfly/react-charts/victory';

import { default as ChartTheme } from './theme-koku-ros';

// Applies theme color and variant to base theme. Chart `chartStyles` should use
// `token.var` (CSS custom properties) for series colors so values track PatternFly
// / Insights dark theme instead of static `token.value` hex.
const getTheme = () => getCustomTheme(ChartThemeColor.default, ChartTheme);

export default getTheme;
