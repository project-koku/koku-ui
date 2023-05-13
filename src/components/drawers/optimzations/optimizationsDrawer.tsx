import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiActions, uiSelectors } from 'store/ui';

import { OptimizationsContent } from './optimizationsContent';

interface OptimizationsDrawerOwnProps {
  children?: React.ReactNode;
}

interface OptimizationsDrawerStateProps {
  isOpen: boolean;
  payload: any;
}

interface OptimizationsDrawerDispatchProps {
  closeOptimizationsDrawer: typeof uiActions.closeOptimizationsDrawer;
}

type OptimizationsDrawerProps = OptimizationsDrawerOwnProps &
  OptimizationsDrawerStateProps &
  OptimizationsDrawerDispatchProps &
  WrappedComponentProps;

class OptimizationsDrawerBase extends React.Component<OptimizationsDrawerProps, any> {
  private drawerRef = React.createRef();

  private handleClose = () => {
    const { closeOptimizationsDrawer } = this.props;

    closeOptimizationsDrawer();
  };

  public render() {
    const { isOpen, payload } = this.props;

    const id = payload ? payload.id : undefined;
    const project = payload ? payload.project : undefined;
    const title = payload ? payload.container : null;

    return (
      <DrawerPanelContent id="optimizationsDrawer" minSize={'750px'}>
        <DrawerHead>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */}
          <span tabIndex={isOpen ? 0 : -1} ref={this.drawerRef}>
            <Title headingLevel="h1" size={TitleSizes.xl}>
              {title}
            </Title>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <OptimizationsContent id={id} onClose={this.handleClose} project={project} />
        </DrawerPanelBody>
      </DrawerPanelContent>
    );
  }
}

const mapStateToProps = createMapStateToProps<OptimizationsDrawerOwnProps, OptimizationsDrawerStateProps>(state => {
  return {
    isOpen: uiSelectors.selectIsOptimizationsDrawerOpen(state),
    payload: uiSelectors.selectOptimizationsDrawerPayload(state),
  };
});

const mapDispatchToProps: OptimizationsDrawerDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
};

const OptimizationsDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OptimizationsDrawerBase));

export default OptimizationsDrawer;
