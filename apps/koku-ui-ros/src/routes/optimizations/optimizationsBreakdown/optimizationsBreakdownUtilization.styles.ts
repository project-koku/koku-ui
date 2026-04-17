import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';

export const chartStyles = {
  chartHeight: 350,
};

export const styles = {
  cardContainer: {
    flexGrow: 1,
  },
  container: {
    display: 'flex',
  },
  dividerContainer: {
    marginRight: `-${t_global_spacer_sm.value}`,
    paddingBottom: t_global_spacer_md.var,
    paddingTop: t_global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };
