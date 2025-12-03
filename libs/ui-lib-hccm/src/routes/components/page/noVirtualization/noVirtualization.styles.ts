import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import t_global_spacer_xs from '@patternfly/react-tokens/dist/js/t_global_spacer_xs';

export const styles = {
  clipboardContainer: {
    textAlign: 'left',
  },
  moreInfo: {
    display: 'block',
  },
  tagKey: {
    marginTop: t_global_spacer_lg.var,
  },
  tagKeyLabel: {
    marginRight: t_global_spacer_sm.var,
  },
  tagValue: {
    marginTop: t_global_spacer_xs.var,
  },
  tagValueLabel: {
    marginRight: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
