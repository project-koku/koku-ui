import { Button, ButtonVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { User } from 'api/users';
import React from 'react';
import { Page } from '../page';
import { styles } from './masthead.styles';

interface Props {
  user: User;
  onLogout(): void;
}

const Masthead: React.SFC<Props> = ({ user, onLogout }) => (
  <Page.Consumer>
    {() => (
      <header className={css(styles.masthead)}>
        Koku
        {user && (
          <div className={css(styles.right)}>
            <div className={css(styles.name)}>{user.username}</div>
            <Button variant={ButtonVariant.tertiary} onClick={onLogout}>
              Logout
            </Button>
          </div>
        )}
      </header>
    )}
  </Page.Consumer>
);

export { Masthead, Props };
