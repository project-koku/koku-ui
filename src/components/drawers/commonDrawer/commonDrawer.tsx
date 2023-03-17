import './commonDrawer.scss';

import { Drawer, DrawerContent, DrawerContentBody } from '@patternfly/react-core';
import { ExportsDrawer } from 'components/drawers';
import { RecommendationsDrawer } from 'components/drawers';
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
      return <ExportsDrawer />;
    } else if (isRecommendationsDrawerOpen) {
      return <RecommendationsDrawer />;
    }
    return null;
  };

  private handleExpand = () => {
    this.drawerRef.current && (this.drawerRef.current as any).focus();
  };

  public render() {
    const { children, isExportsDrawerOpen, isRecommendationsDrawerOpen } = this.props;

    const isExpanded = isExportsDrawerOpen || isRecommendationsDrawerOpen;

    // Set DrawerContentBody className to make drawer sticky, after adding 'overflow:auto' to the 'main' tag
    return (
      <Drawer className="drawerOverride" isExpanded={isExpanded} onExpand={this.handleExpand}>
        <DrawerContent panelContent={this.getPanelContent()}>
          <DrawerContentBody className="pf-u-display-flex pf-u-flex-direction-column">{children}</DrawerContentBody>
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
