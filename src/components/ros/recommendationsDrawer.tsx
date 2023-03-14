import './recommendations.scss';

import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
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

import { RecommendationsContent } from './recommendationsContent';

interface RecommendationsDrawerOwnProps {
  children?: React.ReactNode;
}

interface RecommendationsDrawerStateProps {
  isOpen: boolean;
  payload: any;
}

interface RecommendationsDrawerDispatchProps {
  closeRecommendationsDrawer: typeof uiActions.closeRecommendationsDrawer;
}

type RecommendationsDrawerProps = RecommendationsDrawerOwnProps &
  RecommendationsDrawerStateProps &
  RecommendationsDrawerDispatchProps &
  WrappedComponentProps;

class RecommendationsDrawerBase extends React.Component<RecommendationsDrawerProps> {
  private drawerRef = React.createRef();

  constructor(props: RecommendationsDrawerProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    // TBD...
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidUpdate(prevProps: RecommendationsDrawerProps) {
    // TBD...
  }

  private getPanelContent = () => {
    const { isOpen, payload } = this.props;
    return (
      <DrawerPanelContent id="RecommendationsDrawer" minSize="750px">
        <DrawerHead>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */}
          <span tabIndex={isOpen ? 0 : -1} ref={this.drawerRef}>
            <Title headingLevel="h1" size={TitleSizes.xl}>
              {payload ? payload.container : undefined}
            </Title>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerContentBody>
          <RecommendationsContent onClose={this.handleClose} />
        </DrawerContentBody>
      </DrawerPanelContent>
    );
  };

  private handleClose = () => {
    const { closeRecommendationsDrawer } = this.props;

    closeRecommendationsDrawer();
  };

  private handleExpand = () => {
    this.drawerRef.current && (this.drawerRef.current as any).focus();
  };

  public render() {
    const { children, isOpen } = this.props;

    return (
      <Drawer className="drawerOverride" isExpanded={isOpen} onExpand={this.handleExpand}>
        <DrawerContent panelContent={this.getPanelContent()}>
          <DrawerContentBody>{children}</DrawerContentBody>
        </DrawerContent>
      </Drawer>
    );
  }
}

const mapStateToProps = createMapStateToProps<RecommendationsDrawerOwnProps, RecommendationsDrawerStateProps>(state => {
  return {
    isOpen: uiSelectors.selectIsRecommendationsDrawerOpen(state),
    payload: uiSelectors.selectRecommendationsDrawerPayload(state),
  };
});

const mapDispatchToProps: RecommendationsDrawerDispatchProps = {
  closeRecommendationsDrawer: uiActions.closeRecommendationsDrawer,
};

const RecommendationsDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationsDrawerBase));

export default RecommendationsDrawer;
