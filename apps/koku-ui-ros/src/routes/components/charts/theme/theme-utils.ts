import { ChartThemeColor, getCustomTheme } from '@patternfly/react-charts/victory';

import { default as ChartTheme } from './theme-koku-ros';

// Applies theme color and variant to base theme
const getTheme = () => getCustomTheme(ChartThemeColor.default, ChartTheme);

export default getTheme;
