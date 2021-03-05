import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';

export const styles = {
  chartContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    marginLeft: global_spacer_lg.value,
    marginRight: global_spacer_lg.value,
    paddingRight: global_spacer_lg.value,
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  chartContent: {
    paddingTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
