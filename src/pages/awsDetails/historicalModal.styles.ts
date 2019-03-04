import { StyleSheet } from '@patternfly/react-styles';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  modal: {
    // Workaround for isLarge not working properly
    height: '850px',
    width: '950px',
  },
});

export const modalOverride = css`
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
