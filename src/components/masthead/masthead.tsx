import { Nav } from 'patternfly-react/dist/js/components/Nav';
import { Navbar } from 'patternfly-react/dist/js/components/Navbar';
import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from 'styles/stylesheet';
import { Page } from '../page';
import { classes } from './masthead.styles';

interface Props {
  brandIcon?: string;
  brandName?: string;
  children?: React.ReactNode;
  user: any;
  onMenuClick?(): void;
  onLogout(): void;
  onLogin(): void;
}

const defaultProps: Partial<Props> = {
  brandIcon: 'http://www.patternfly.org/assets/img/logo-alt.svg',
  brandName: 'http://www.patternfly.org/assets/img/brand-alt.svg',
  user: null,
};

const Masthead: React.SFC<Props> = ({
  brandIcon,
  brandName,
  user,
  onLogin,
  onLogout,
}) => (
  <Page.Consumer>
    {({ onToggleVertcalNavOpen }) => (
      <header className={classNames(classes.navbar, classes.tall)}>
        <Navbar.Header>
          <Navbar.Toggle onClick={onToggleVertcalNavOpen} />
          <Navbar.Brand>
            <Link to="/">
              <img
                alt="Brand Icon"
                className={classNames(classes.brandIcon)}
                src={brandIcon}
              />
              <img
                alt="Brand Name"
                className={classNames(classes.brandName)}
                src={brandName}
              />
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight navbar>
            {Boolean(user) ? (
              <button onClick={onLogout}>Logout</button>
            ) : (
              <button onClick={onLogin}>Login</button>
            )}
          </Nav>
        </Navbar.Collapse>
      </header>
    )}
  </Page.Consumer>
);

Masthead.defaultProps = defaultProps;

export { Masthead, Props };
