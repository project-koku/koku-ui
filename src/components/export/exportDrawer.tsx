import './export.scss';

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
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiActions, uiSelectors } from 'store/ui';

import { ExportContent } from './exportContent';

interface ExportDrawerOwnProps {
  children?: React.ReactNode;
}

interface ExportDrawerStateProps {
  isOpen: boolean;
}

interface ExportDrawerDispatchProps {
  closeExportDrawer: typeof uiActions.closeExportDrawer;
}

type ExportDrawerProps = ExportDrawerOwnProps &
  ExportDrawerStateProps &
  ExportDrawerDispatchProps &
  WrappedComponentProps;

class ExportDrawerBase extends React.Component<ExportDrawerProps> {
  private drawerRef = React.createRef();

  constructor(props: ExportDrawerProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    // TBD...
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidUpdate(prevProps: ExportDrawerProps) {
    // TBD...
  }

  private getPanelContent = () => {
    const { intl, isOpen } = this.props;

    return (
      <DrawerPanelContent minSize="1100px">
        <DrawerHead>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          /* @ts-ignore */}
          <span tabIndex={isOpen ? 0 : -1} ref={this.drawerRef}>
            <Title headingLevel="h1" size={TitleSizes.xl}>
              {intl.formatMessage(messages.ExportAllExports)}
            </Title>
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={this.handleClose} />
          </DrawerActions>
        </DrawerHead>
        <DrawerContentBody>
          <ExportContent />
        </DrawerContentBody>
      </DrawerPanelContent>
    );
  };

  private handleClose = () => {
    const { closeExportDrawer } = this.props;

    closeExportDrawer();
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

const mapStateToProps = createMapStateToProps<ExportDrawerOwnProps, ExportDrawerStateProps>(state => {
  const isOpen = uiSelectors.selectIsExportDrawerOpen(state);

  return {
    isOpen,
  };
});

const mapDispatchToProps: ExportDrawerDispatchProps = {
  closeExportDrawer: uiActions.closeExportDrawer,
};

const ExportDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportDrawerBase));

export { ExportDrawer };
