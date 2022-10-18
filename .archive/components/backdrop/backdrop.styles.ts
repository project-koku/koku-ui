import {
  c_backdrop_BackdropFilter,
  c_backdrop_Color,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    filter: c_backdrop_BackdropFilter.value,
    backgroundColor: c_backdrop_Color.value,
  },
} as { [className: string]: React.CSSProperties };
