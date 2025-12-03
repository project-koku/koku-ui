import { Drawer, DrawerContent } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { uiSelectors } from '../../../store/ui';
import { ExportsDrawer } from '../exports';

interface CommonDrawerOwnProps {
  children?: React.ReactNode;
}

interface CommonDrawerStateProps {
  isExportsDrawerOpen: boolean;
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
    const { isExportsDrawerOpen } = this.props;

    if (isExportsDrawerOpen) {
      return <ExportsDrawer />;
    }
    return null;
  };

  private handleExpand = () => {
    (this.drawerRef?.current as any)?.focus();
  };

  public render() {
    const { children, isExportsDrawerOpen } = this.props;

    const isExpanded = isExportsDrawerOpen;

    // Sticky drawer is based on RHOSAK app, see:
    // https://github.com/redhat-developer/rhosak-ui/blob/main/apps/consoledot-rhosak/src/AppEntry.tsx#L30-L37
    // https://github.com/redhat-developer/rhosak-ui/blob/main/packages/ui/src/components/KafkaInstanceDrawer/KafkaInstanceDrawer.tsx#L69-L78
    return (
      <Drawer className="drawerOverride" isExpanded={isExpanded} onExpand={this.handleExpand}>
        <DrawerContent colorVariant="secondary" panelContent={this.getPanelContent()}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }
}

const mapStateToProps = createMapStateToProps<CommonDrawerOwnProps, CommonDrawerStateProps>(state => {
  return {
    isExportsDrawerOpen: uiSelectors.selectIsExportsDrawerOpen(state),
    isOptimizationsDrawerOpen: uiSelectors.selectIsOptimizationsDrawerOpen(state),
  };
});

const mapDispatchToProps: CommonDrawerDispatchProps = {
  // TBD...
};

const CommonDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(CommonDrawerBase));

export default CommonDrawer;
