import {
  c_card_BackgroundColor,
  global_Color_100,
  global_Color_200,
  global_Color_light_100,
  global_Color_light_200,
  global_spacer_lg,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

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

export const emptyState = css`
  & ul {
    list-style-type: initial;
    margin-left: 20px;
  }
`;
