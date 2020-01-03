import { StyleSheet } from '@patternfly/react-styles';
import {
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  chartSkeleton: {
    marginBottom: global_spacer_md.value,
  },
  freeSpace: {
    marginBottom: global_spacer_lg.value,
    marginLeft: global_spacer_sm.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
});
