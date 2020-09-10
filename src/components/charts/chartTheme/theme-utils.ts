import { ChartThemeColor, ChartThemeVariant, getCustomTheme } from '@patternfly/react-charts';

import { default as ChartTheme } from './theme-koku';

// Applies theme color and variant to base theme
const getTheme = () => getCustomTheme(ChartThemeColor.default, ChartThemeVariant.default, ChartTheme);

export default getTheme;
