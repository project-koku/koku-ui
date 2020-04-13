import { global_FontSize_xl, global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  card: {
    minHeight: '130px',
    maxWidth: '400px',
    marginLeft: global_spacer_md.value,
  },
  cardBody: {
    fontSize: global_FontSize_xl.value,
    textAlign: 'center',
  },
} as { [className: string]: React.CSSProperties };
