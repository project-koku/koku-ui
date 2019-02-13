import { StyleSheet } from '@patternfly/react-styles';
import {
  global_Color_100,
  global_spacer_2xl,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  modal: {
    // Workaround for PatternFly setting Grid color property
    color: global_Color_100.value,
    // Workaround for isLarge not working properly
    height: '700px',
    width: '600px',
  },
  modalBody: {
    marginBottom: global_spacer_md.value,
    marginTop: global_spacer_xl.value,
  },
  summary: {
    marginTop: global_spacer_xl.value,
  },
  totalCost: {
    marginTop: global_spacer_2xl.value,
    textAlign: 'right',
  },
});

export const modalOverride = css`
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
