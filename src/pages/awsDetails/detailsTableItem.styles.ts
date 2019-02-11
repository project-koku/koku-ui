import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_3xl,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
// import { css } from 'emotion';

export const styles = StyleSheet.create({
  accountsContainer: {
    paddingTop: global_spacer_xl.value,
  },
  historicalLinkContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: global_spacer_xl.value,
  },
  innerGroupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  measureChartContainer: {
    paddingTop: global_spacer_xl.value,
  },
  summaryContainer: {
    marginRight: global_spacer_3xl.value,
  },
});
