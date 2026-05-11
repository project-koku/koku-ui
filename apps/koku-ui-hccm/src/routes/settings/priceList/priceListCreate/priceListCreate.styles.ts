import { t_global_spacer_sm } from '@patternfly/react-tokens';
import type React from 'react';

export const styles = {
  detailsContent: {
    width: '75%',
  },
  divider: {
    marginBottom: t_global_spacer_sm.var,
    marginTop: t_global_spacer_sm.var,
  },
  headerContainer: {
    paddingBottom: 0,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
} as { [className: string]: React.CSSProperties };
