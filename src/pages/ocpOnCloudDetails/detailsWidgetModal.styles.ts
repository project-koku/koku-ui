import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_lg, global_spacer_xl } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  mainContent: {
    marginTop: global_spacer_xl.value,
  },
  modal: {
    // Workaround for isLarge not working properly
    height: '700px',
    width: '600px',
  },
  subTitle: {
    textAlign: 'right',
  },
});

export const modalOverride = css`
  & .pf-c-modal-box__body {
    margin-top: ${global_spacer_lg.value};
  }
  & .pf-c-modal-box__footer {
    display: none;
  }
`;
