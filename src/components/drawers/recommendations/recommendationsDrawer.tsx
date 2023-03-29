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

class RecommendationsDrawerBase extends React.Component<RecommendationsDrawerProps, any> {
  private drawerRef = React.createRef();

  private handleClose = () => {
    const { closeRecommendationsDrawer } = this.props;

    closeRecommendationsDrawer();
  };

  public render() {
    const { isOpen, payload } = this.props;

    return (
      <DrawerPanelContent id="recommendationsDrawer" minSize={'750px'}>
        <DrawerHead>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */}
          <span tabIndex={isOpen ? 0 : -1} ref={this.drawerRef}>
            <Title headingLevel="h1" size={TitleSizes.xl}>
              {payload ? payload.container : null}
            </Title>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <RecommendationsContent onClose={this.handleClose} />
        </DrawerPanelBody>
      </DrawerPanelContent>
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
