import { StyleSheet } from '@patternfly/react-styles';
import { global_spacer_lg, global_spacer_xl } from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  banner: {
    padding: `0 ${global_spacer_xl.value}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    padding: `0 ${global_spacer_xl.value}`,
  },
});

export const theme = css`
  padding-bottom: ${global_spacer_lg.var};
`;
