import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  chartContainer: {
    marginLeft: global_spacer_lg.value,
  },
  chargeChart: {
    marginTop: global_spacer_sm.value,
  },
  cpuChart: {
    marginTop: global_spacer_3xl.value,
  },
  memoryChart: {
    marginTop: global_spacer_3xl.value,
  },
});
