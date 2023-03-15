import './commonDrawer.scss';

import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent } from '@patternfly/react-core';
import ExportsDrawer from 'components/exports/exportsDrawer';
import { RecommendationsDrawer } from 'components/recommendations';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiSelectors } from 'store/ui';

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
        <DrawerPanelContent id="recommendationsDrawer" minSize="750px">
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

    return (
      <Drawer
        className="drawerOverride"
        isExpanded={isExportsDrawerOpen || isRecommendationsDrawerOpen}
        onExpand={this.handleExpand}
      >
        <DrawerContent panelContent={this.getPanelContent()}>
          <DrawerContentBody>{children}</DrawerContentBody>
        </DrawerContent>
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
