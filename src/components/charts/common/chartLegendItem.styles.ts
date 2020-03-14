import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BorderWidth_sm,
  global_Color_200,
  global_FontSize_xs,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import { chartStyles } from './chart.styles';

export const styles = StyleSheet.create({
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: global_FontSize_xs.value,
    color: global_Color_200.var,
    marginRight: global_spacer_md.value,
  },
  color: {
    height: 10,
    width: 10,
    marginRight: global_spacer_sm.value,
    borderWidth: global_BorderWidth_sm.value,
    borderStyle: 'solid',
  },
  currentColor: {
    backgroundColor: chartStyles.currentMonth.data.fill,
    borderColor: chartStyles.currentMonth.data.stroke,
  },
  previousColor: {
    backgroundColor: chartStyles.previousMonth.data.fill,
    borderColor: chartStyles.previousMonth.data.stroke,
  },
});
