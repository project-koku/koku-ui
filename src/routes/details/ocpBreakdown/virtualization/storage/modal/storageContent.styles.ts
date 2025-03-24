import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import type React from 'react';

export const styles = {
  dataListHeading: {
    fontWeight: global_FontWeight_bold.value as any,
  },
  dataListSubHeading: {
    marginBottom: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
