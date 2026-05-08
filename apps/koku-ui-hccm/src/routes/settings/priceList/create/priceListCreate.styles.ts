import { t_global_spacer_lg, t_global_spacer_xl } from '@patternfly/react-tokens';
import type React from 'react';

export const styles = {
  detailsContent: {
    width: '75%',
  },
  divider: {
    marginBottom: t_global_spacer_lg.var,
    marginTop: t_global_spacer_xl.var,
  },
  headerContainer: {
    paddingBottom: 0,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
} as { [className: string]: React.CSSProperties };
