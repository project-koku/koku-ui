import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_3xl, global_spacer_xl } from '@patternfly/react-tokens';
// import { css } from 'emotion';

export const styles = StyleSheet.create({
  historicalLinkContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: global_spacer_xl.value,
  },
  measureChartContainer: {
    paddingTop: global_spacer_xl.value,
  },
  projectsContainer: {
    paddingTop: global_spacer_xl.value,
  },
  summaryContainer: {
    marginRight: global_spacer_3xl.value,
  },
});
