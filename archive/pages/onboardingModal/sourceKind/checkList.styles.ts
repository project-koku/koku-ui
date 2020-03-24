import { global_spacer_md } from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  listWrapper: {
    paddingLeft: global_spacer_md.value,
    marginBottom: global_spacer_md.value,
    marginTop: `-${global_spacer_md.value}`,
  },
  listTitle: {
    marginBottom: global_spacer_md.value,
  },
} as { [className: string]: React.CSSProperties };
