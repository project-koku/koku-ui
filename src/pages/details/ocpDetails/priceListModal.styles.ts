import { StyleSheet } from '@patternfly/react-styles';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  modal: {
    // Workaround for isLarge not working properly
    height: '900px',
    width: '1100px',
  },
});

export const modalOverride = css`
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
