// tslint:disable jsx-no-lambda
import { css } from '@patternfly/react-styles';
import React from 'react';
import { I18n } from 'react-i18next';
import { Link, Route } from 'react-router-dom';
import { AppRoute } from 'routes';
import { getTestProps, testIds } from 'testIds';
import { styles } from './verticalNavItem.styles';

export interface Props extends AppRoute {
  isDisabled?: boolean;
  onClick?(event: React.MouseEvent<HTMLAnchorElement>): void;
  icon: React.SFC<any>;
}

export const VerticalNavItem: React.SFC<Props> = ({
  path,
  labelKey,
  isDisabled,
  exact,
  strict,
  onClick,
  icon: Icon,
  ...props
}) => (
  <I18n>
    {t => (
      <Route
        path={path}
        exact={exact}
        strict={strict}
        children={({ match }) => {
          const isActive = Boolean(match);

          return (
            <li>
              <Link
                to={path}
                className={css(
                  styles.verticalNavLink,
                  isActive && styles.verticalNavLinkActive
                )}
                onClick={onClick}
                aria-current={isActive ? 'page' : null}
                aria-disabled={isDisabled ? true : null}
                {...getTestProps(testIds.sidebar.link)}
              >
                <Icon style={styles.icon} size="sm" />
                <span
                  className={css(styles.text, isActive && styles.textActive)}
                >
                  {t(labelKey)}
                </span>
              </Link>
            </li>
          );
        }}
      />
    )}
  </I18n>
);

VerticalNavItem.defaultProps = {
  isDisabled: false,
};
