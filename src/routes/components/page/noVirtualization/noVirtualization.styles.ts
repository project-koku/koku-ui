import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import global_spacer_sm from '@patternfly/react-tokens/dist/js/global_spacer_sm';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';

export const styles = {
  clipboardContainer: {
    textAlign: 'left',
  },
  moreInfo: {
    display: 'block',
  },
  tagKey: {
    marginTop: global_spacer_lg.var,
  },
  tagKeyLabel: {
    marginRight: global_spacer_sm.var,
  },
  tagValue: {
    marginTop: global_spacer_xs.var,
  },
  tagValueLabel: {
    marginRight: global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
