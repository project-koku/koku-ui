import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const chartStyles = {
  chartHeight: 125,
};

export const styles = StyleSheet.create({
  chartContainer: {
    marginLeft: global_spacer_lg.value,
  },
  chartSkeleton: {
    height: '125px',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_3xl.value,
  },
  costChart: {
    marginTop: global_spacer_sm.value,
  },
  instanceChart: {
    marginTop: global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
  storageChart: {
    marginTop: global_spacer_sm.value,
  },
});
