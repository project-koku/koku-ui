import t_global_spacer_lg from '@patternfly/react-tokens/dist/js/t_global_spacer_lg';
import t_global_spacer_md from '@patternfly/react-tokens/dist/js/t_global_spacer_md';
import t_global_spacer_sm from '@patternfly/react-tokens/dist/js/t_global_spacer_sm';
import type React from 'react';

export const styles = {
  calendarContainer: {
    marginBottom: t_global_spacer_md.var,
    marginRight: t_global_spacer_lg.var,
  },
  currencyPairDesc: {
    marginTop: t_global_spacer_sm.var,
  },
  selector: {
    maxHeight: '250px',
  },
  swapCurrency: {
    alignContent: 'end',
    height: '100%',
  },
  validityAlert: {
    marginTop: t_global_spacer_sm.var,
  },
  validityPeriodDesc: {
    marginBottom: t_global_spacer_sm.var,
  },
} as { [className: string]: React.CSSProperties };
