import { ChartThemeColor, mergeTheme } from '@patternfly/react-charts';

import { default as ChartTheme } from './theme-koku';

// Applies theme color and variant to base theme
const getTheme = () => mergeTheme(ChartThemeColor.default, ChartTheme);

export default getTheme;
