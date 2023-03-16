import './commonDrawer.scss';

import { Drawer, DrawerContent, DrawerPanelContent } from '@patternfly/react-core';
import { ExportsDrawer } from 'components/drawers';
import { RecommendationsDrawer } from 'components/drawers';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiSelectors } from 'store/ui';

import { styles } from './commonDrawer.styles';

interface CommonDrawerOwnProps {
  children?: React.ReactNode;
}

interface CommonDrawerStateProps {
  isExportsDrawerOpen: boolean;
  isRecommendationsDrawerOpen: boolean;
}

interface CommonDrawerDispatchProps {
  // TBD...
}

type CommonDrawerProps = CommonDrawerOwnProps &
  CommonDrawerStateProps &
  CommonDrawerDispatchProps &
  WrappedComponentProps;

class CommonDrawerBase extends React.Component<CommonDrawerProps> {
  private drawerRef = React.createRef();

  private getPanelContent = () => {
    const { isExportsDrawerOpen, isRecommendationsDrawerOpen } = this.props;

    if (isExportsDrawerOpen) {
      return (
        <DrawerPanelContent id="exportsDrawer" minSize="1000px">
          <ExportsDrawer />
        </DrawerPanelContent>
      );
    } else if (isRecommendationsDrawerOpen) {
      return (
        <DrawerPanelContent id="recommendationsDrawer" minSize={'750px'}>
          <RecommendationsDrawer />
        </DrawerPanelContent>
      );
    }
    return null;
  };

  private handleExpand = () => {
    this.drawerRef.current && (this.drawerRef.current as any).focus();
  };

  public render() {
    const { children, isExportsDrawerOpen, isRecommendationsDrawerOpen } = this.props;

    const isExpanded = isExportsDrawerOpen || isRecommendationsDrawerOpen;

    // Override to make drawer sticky
    const collection = document.getElementsByClassName('cost-management');
    if (collection) {
      const element = collection[0] as any;
      element.style.position = isExpanded ? styles.drawerContainer.position : undefined;
      element.style.height = isExpanded ? styles.drawerContainer.height : undefined;
      element.style.width = isExpanded ? styles.drawerContainer.width : undefined;
    }
    return (
      <Drawer className="drawerOverride" isExpanded={isExpanded} onExpand={this.handleExpand}>
        <DrawerContent panelContent={this.getPanelContent()}>{children}</DrawerContent>
      </Drawer>
    );
  }
}

const mapStateToProps = createMapStateToProps<CommonDrawerOwnProps, CommonDrawerStateProps>(state => {
  return {
    isExportsDrawerOpen: uiSelectors.selectIsExportsDrawerOpen(state),
    isRecommendationsDrawerOpen: uiSelectors.selectIsRecommendationsDrawerOpen(state),
  };
});

const mapDispatchToProps: CommonDrawerDispatchProps = {
  // TBD...
};

const CommonDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(CommonDrawerBase));

export default CommonDrawer;
