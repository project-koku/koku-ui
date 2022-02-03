import { Button } from '@patternfly/react-core';
import { AngleDoubleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiSelectors } from 'store/ui';
import { uiActions } from 'store/ui';

import { styles } from './export.styles';

interface ExportLinkOwnProps {
  // TBD...
}

interface ExportLinkStateProps {
  isOpen?: boolean;
}

interface ExportLinkDispatchProps {
  closeExportDrawer: typeof uiActions.closeExportDrawer;
  openExportDrawer: typeof uiActions.openExportDrawer;
}

type ExportLinkProps = ExportLinkOwnProps & ExportLinkStateProps & ExportLinkDispatchProps & WrappedComponentProps;

class ExportLinkBase extends React.Component<ExportLinkProps> {
  private handleToggle = event => {
    const { closeExportDrawer, isOpen, openExportDrawer } = this.props;

    if (isOpen) {
      closeExportDrawer();
    } else {
      openExportDrawer();
    }
    event.preventDefault();
    return false;
  };

  public render() {
    const { intl } = this.props;

    return (
      <div style={styles.exportLink}>
        <Button component="a" href="#/" variant="link" onClick={this.handleToggle}>
          <span style={styles.exportIcon}>
            <AngleDoubleLeftIcon />
          </span>
          {intl.formatMessage(messages.ExportAllExports)}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportLinkOwnProps, ExportLinkStateProps>((state, props) => {
  const isOpen = uiSelectors.selectIsExportDrawerOpen(state);

  return {
    isOpen,
  };
});

const mapDispatchToProps: ExportLinkDispatchProps = {
  closeExportDrawer: uiActions.closeExportDrawer,
  openExportDrawer: uiActions.openExportDrawer,
};

const ExportLink = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportLinkBase));

export { ExportLink };
