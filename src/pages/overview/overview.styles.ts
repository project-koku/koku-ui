import { StyleSheet } from '@patternfly/react-styles';
import {
  c_card_BackgroundColor,
  global_Color_100,
  global_Color_200,
  global_Color_light_100,
  global_Color_light_200,
  global_spacer_lg,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  banner: {
    height: 60,
    color: global_Color_100.var,
    padding: `0 ${global_spacer_xl.value}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    color: global_Color_100.var,
    padding: `0 ${global_spacer_xl.value}`,
  },
});

export const theme = css`
  min-height: 100%;
  padding-bottom: ${global_spacer_lg.var};
  background-color: rgba(0, 0, 0, 0.5);
  ${global_Color_100.name}: ${global_Color_light_100.value};
  ${global_Color_200.name}: ${global_Color_light_200.value};

  & .pf-c-card {
    ${global_Color_100.name}: ${global_Color_light_100.value};
    ${global_Color_200.name}: ${global_Color_light_200.value};
    ${c_card_BackgroundColor.name}: rgba(0, 0, 0, 0.5);
  }
`;
