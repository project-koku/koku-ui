import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const chartStyles = {
  chartHeight: 125,
};

export const styles = StyleSheet.create({
  chartContainer: {
    marginLeft: global_spacer_lg.value,
  },
  costChart: {
    marginTop: global_spacer_sm.value,
  },
  instanceChart: {
    marginTop: global_spacer_3xl.value,
  },
  storageChart: {
    marginTop: global_spacer_3xl.value,
  },
});
