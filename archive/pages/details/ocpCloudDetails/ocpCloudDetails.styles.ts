import {
  global_BackgroundColor_light_100,
  global_BackgroundColor_light_200,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  content: {
    backgroundColor: global_BackgroundColor_light_200.value,
    paddingBottom: global_spacer_xl.value,
    paddingTop: global_spacer_xl.value,
  },
  ocpCloudDetails: {
    backgroundColor: global_BackgroundColor_light_200.value,
    minHeight: '100%',
  },
  paginationContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
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
