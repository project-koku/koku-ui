import { ChartThemeColor, getCustomTheme } from '@patternfly/react-charts';

import { default as ChartTheme } from './theme-koku';

// Applies theme color and variant to base theme
const getTheme = () => getCustomTheme(ChartThemeColor.default, null, ChartTheme);

export default getTheme;
