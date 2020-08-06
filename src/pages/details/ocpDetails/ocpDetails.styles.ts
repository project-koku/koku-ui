import { global_BackgroundColor_light_100 } from '@patternfly/react-tokens/dist/esm/global_BackgroundColor_light_100';
import { global_spacer_md } from '@patternfly/react-tokens/dist/esm/global_spacer_md'
import { global_spacer_xl } from '@patternfly/react-tokens/dist/esm/global_spacer_xl';
import React from 'react';

export const styles = {
  content: {
    paddingBottom: global_spacer_xl.value,
    paddingTop: global_spacer_xl.value,
  },
  ocpDetails: {
    minHeight: '100%',
  },
  paginationContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
  pagination: {
    backgroundColor: global_BackgroundColor_light_100.value,
    padding: global_spacer_md.value,
  },
  tableContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
} as { [className: string]: React.CSSProperties };
