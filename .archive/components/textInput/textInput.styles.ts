import {
  global_BorderColor_100,
  global_BorderColor_dark_100,
  global_BorderWidth_md,
  global_BorderWidth_sm,
  global_danger_color_100,
  global_danger_color_200,
  global_FontSize_md,
  global_spacer_sm,
  global_spacer_xl,
  global_spacer_xs,
} from '@patternfly/react-tokens';
import React from 'react';

export const styles = {
  textInput: {
    width: '100%',
    fontSize: global_FontSize_md.value,
    paddingTop: global_spacer_xs.value,
    paddingRight: global_spacer_xl.value,
    paddingBottom: global_spacer_xs.value,
    paddingLeft: global_spacer_sm.value,
    lineHeight: '24px',
    outline: 0,
    border: `${global_BorderWidth_sm.value} solid ${global_BorderColor_100.value}`,
    ':focus': {
      borderColor: global_BorderColor_dark_100.value,
    },
  },
  flat: {
    border: 'none',
    borderBottom: [
      global_BorderWidth_sm.value,
      'solid',
      global_BorderColor_100.value,
    ].join(' '),
    ':focus': {
      borderBottom: [
        global_BorderWidth_md.value,
        'solid',
        global_BorderColor_dark_100.value,
      ].join(' '),
    },
  },
  error: {
    borderColor: global_danger_color_100.value,
    ':focus': {
      borderColor: global_danger_color_200.value,
    },
  },
} as { [className: string]: React.CSSProperties };
