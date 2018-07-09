import { StyleSheet } from '@patternfly/react-styles';
import {
  global_Color_active,
  global_Color_dark_100,
  global_spacer_lg,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { StyleDeclaration } from 'aphrodite';

const activeIdicator: StyleDeclaration = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '2rem',
  height: '0.25rem',
  content: '""',
  backgroundColor: global_Color_active.value,
};

export const styles = StyleSheet.create({
  verticalNavLink: {
    display: 'flex',
    alignItems: 'baseline',
    paddingRight: global_spacer_xl.value,
    paddingLeft: global_spacer_xl.value,
    color: global_Color_dark_100.value,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    ':hover': {
      textDecoration: 'none',
    },
  },
  verticalNavLinkActive: {
    color: global_Color_active.value,
  },
  text: {
    position: 'relative',
    flex: 1,
    paddingTop: global_spacer_lg.value,
    paddingBottom: global_spacer_lg.value,
    ':hover': {
      '::after': activeIdicator,
    },
  },
  textActive: {
    '::after': activeIdicator,
  },
});
