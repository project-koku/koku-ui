import { StyleSheet } from '@patternfly/react-styles';
import {
  global_Color_dark_100,
  global_Color_light_100,
  global_FontSize_xs,
  global_primary_color_200,
  global_spacer_md,
} from '@patternfly/react-tokens';
import { VictoryStyleInterface } from 'victory';

export const chartStyles = {
  padding: { top: 8, bottom: 8 },
  pie: {
    data: {
      strokeWidth: 0,
      fillOpacity: 0.7,
      stroke: global_primary_color_200.value,
    },
  } as VictoryStyleInterface,
  tooltipText: {
    fontSize: global_FontSize_xs.value,
    fill: global_Color_light_100.value,
  } as React.CSSProperties,
  tooltipFlyout: { stroke: global_Color_dark_100.value } as React.CSSProperties,
};

export const styles = StyleSheet.create({
  pieGroup: {
    display: 'flex',
    float: 'left',
    position: 'relative',
    paddingTop: '2rem',
    marginLeft: '2rem',
    left: '-40px',
  },
});

export const legendStyles = StyleSheet.create({
  legend: {
    display: 'block',
    alignItems: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: global_FontSize_xs.value,
    color: global_Color_dark_100.var,
    marginRight: global_spacer_md.value,
  },
});
