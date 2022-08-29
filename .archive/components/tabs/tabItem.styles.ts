import {
  global_FontSize_md,
  global_primary_color_100,
  global_spacer_md,
  global_spacer_sm,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  tabItem: {
    position: 'relative',
    flexGrow: 1,
    textAlign: 'center',
    fontSize: global_FontSize_md.value,
    padding: global_spacer_sm.value,
    cursor: 'pointer',
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_md.value,
  },
  tabItemShrink: {
    flexGrow: 0,
    flexShrink: 2,
    marginRight: '20px',
  },
  selected: {
    backgroundImage: `linear-gradient(to top, ${global_primary_color_100.value} 2px, transparent 2px)`,
  },
} as { [className: string]: React.CSSProperties };
