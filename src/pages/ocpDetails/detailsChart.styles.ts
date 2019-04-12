import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_md, global_spacer_xl } from '@patternfly/react-tokens';

export const styles = StyleSheet.create({
  cpuBulletContainer: {
    paddingRight: '2rem',
  },
  memoryBulletContainer: {
    paddingBottom: global_spacer_xl.value,
    paddingRight: '2rem',
    paddingTop: global_spacer_xl.value,
  },
  chartSkeleton: {
    marginBottom: global_spacer_md.value,
  },
  legendSkeleton: {
    marginTop: global_spacer_md.value,
  },
});
