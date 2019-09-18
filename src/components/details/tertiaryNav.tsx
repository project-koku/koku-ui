import {
  Nav,
  NavItem,
  NavList,
  NavVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { styles } from '../../pages/azureDetails/detailsHeader.styles';

export const enum TertiaryNavItem {
  aws = 'aws',
  azure = 'azure',
}

export const getIdKeyForNavItem = (navItem: TertiaryNavItem) => {
  switch (navItem) {
    case TertiaryNavItem.aws:
      return 'aws';
    case TertiaryNavItem.azure:
      return 'azure';
  }
};

interface TertiaryNavOwnProps {
  activeItem: TertiaryNavItem;
}

interface AvailableNavItem {
  navItem: TertiaryNavItem;
}

type TertiaryNavProps = TertiaryNavOwnProps &
  InjectedTranslateProps &
  RouteComponentProps<void>;

export class TertiaryNavBase extends React.Component<TertiaryNavProps> {
  private getAvailableNavItems = () => {
    const availableTabs = [
      {
        navItem: TertiaryNavItem.aws,
      },
      {
        navItem: TertiaryNavItem.azure,
      },
    ];
    return availableTabs;
  };

  private getNavItemTitle = (navItem: TertiaryNavItem) => {
    const { t } = this.props;

    if (navItem === TertiaryNavItem.aws) {
      return t('aws_details.title');
    } else if (navItem === TertiaryNavItem.azure) {
      return t('azure_details.title');
    }
  };

  private getNavItem = (navItem: TertiaryNavItem, index: number) => {
    const { activeItem } = this.props;
    const navItemKey = getIdKeyForNavItem(navItem);

    return (
      <NavItem
        key={navItemKey}
        itemId={navItemKey}
        isActive={activeItem === navItem}
      >
        <Title className={css(styles.title)} size={TitleSize['2xl']}>
          {this.getNavItemTitle(navItem)}
        </Title>
      </NavItem>
    );
  };

  // tslint:disable-next-line:no-empty
  public handleOnSelect = selectedItem => {
    const { history } = this.props;
    if (selectedItem.itemId === TertiaryNavItem.aws) {
      history.replace('/aws');
    } else if (selectedItem.itemId === TertiaryNavItem.azure) {
      history.replace('/azure');
    }
  };

  public render() {
    const availableNavItems: AvailableNavItem[] = this.getAvailableNavItems();

    return (
      <Nav onSelect={this.handleOnSelect}>
        <NavList variant={NavVariants.tertiary}>
          {availableNavItems.map((val, index) =>
            this.getNavItem(val.navItem, index)
          )}
        </NavList>
      </Nav>
    );
  }
}

const TertiaryNav = withRouter(translate()(TertiaryNavBase));

export { TertiaryNav };
