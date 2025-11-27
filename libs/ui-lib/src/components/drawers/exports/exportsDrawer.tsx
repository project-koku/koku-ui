import messages from '@koku-ui/i18n/locales/messages';
import {
  DrawerActions,
  DrawerCloseButton,
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

import { createMapStateToProps } from '../../../store/common';
import { uiActions, uiSelectors } from '../../../store/ui';
import { ExportsContent } from './exportsContent';

interface ExportsDrawerOwnProps {
  children?: React.ReactNode;
}

interface ExportsDrawerStateProps {
  isOpen: boolean;
}

interface ExportsDrawerDispatchProps {
  closeExportsDrawer: typeof uiActions.closeExportsDrawer;
}

type ExportsDrawerProps = ExportsDrawerOwnProps &
  ExportsDrawerStateProps &
  ExportsDrawerDispatchProps &
  WrappedComponentProps;

class ExportsDrawerBase extends React.Component<ExportsDrawerProps, any> {
  private drawerRef = React.createRef();

  private handleClose = () => {
    const { closeExportsDrawer } = this.props;

    closeExportsDrawer();
  };

  public render() {
    const { intl, isOpen } = this.props;

    return (
      <DrawerPanelContent id="exportsDrawer" minSize={'1000px'}>
        <DrawerHead>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */}
          <span tabIndex={isOpen ? 0 : -1} ref={this.drawerRef}>
            <Title headingLevel="h1" size={TitleSizes.xl}>
              {intl.formatMessage(messages.exportsTitle)}
            </Title>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerContentBody>
          <ExportsContent onClose={this.handleClose} />
        </DrawerContentBody>
      </DrawerPanelContent>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportsDrawerOwnProps, ExportsDrawerStateProps>(state => {
  return {
    isOpen: uiSelectors.selectIsExportsDrawerOpen(state),
  };
});

const mapDispatchToProps: ExportsDrawerDispatchProps = {
  closeExportsDrawer: uiActions.closeExportsDrawer,
};

const ExportsDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportsDrawerBase));

export default ExportsDrawer;
