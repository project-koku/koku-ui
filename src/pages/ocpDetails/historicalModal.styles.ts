import { StyleSheet } from '@patternfly/react-styles';
import { global_Color_100 } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  modal: {
    // Workaround for PatternFly setting Grid color property
    color: global_Color_100.value,
    // Workaround for isLarge not working properly
    height: '700px',
    width: '800px',
  },
});

export const modalOverride = css`
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
