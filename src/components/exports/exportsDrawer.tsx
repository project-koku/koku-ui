import './exports.scss';

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

class ExportsDrawerBase extends React.Component<ExportsDrawerProps> {
  private drawerRef = React.createRef();

  constructor(props: ExportsDrawerProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public componentDidMount() {
    // TBD...
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public componentDidUpdate(prevProps: ExportsDrawerProps) {
    // TBD...
  }

  private getPanelContent = () => {
    const { intl, isOpen } = this.props;

    return (
      <DrawerPanelContent minSize="1000px">
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
  };

  private handleClose = () => {
    const { closeExportsDrawer } = this.props;

    closeExportsDrawer();
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

const mapStateToProps = createMapStateToProps<ExportsDrawerOwnProps, ExportsDrawerStateProps>(state => {
  const isOpen = uiSelectors.selectIsExportsDrawerOpen(state);

  return {
    isOpen,
  };
});

const mapDispatchToProps: ExportsDrawerDispatchProps = {
  closeExportsDrawer: uiActions.closeExportsDrawer,
};

const ExportsDrawer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportsDrawerBase));

export { ExportsDrawer };
