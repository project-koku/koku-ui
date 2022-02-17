import { Button } from '@patternfly/react-core';
import { AngleDoubleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { uiSelectors } from 'store/ui';
import { uiActions } from 'store/ui';

import { styles } from './exports.styles';

interface ExportsLinkOwnProps {
  // TBD...
}

interface ExportsLinkStateProps {
  isOpen?: boolean;
}

interface ExportsLinkDispatchProps {
  closeExportDrawer: typeof uiActions.closeExportsDrawer;
  openExportDrawer: typeof uiActions.openExportsDrawer;
}

type ExportsLinkProps = ExportsLinkOwnProps & ExportsLinkStateProps & ExportsLinkDispatchProps & WrappedComponentProps;

class ExportsLinkBase extends React.Component<ExportsLinkProps> {
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
      <div style={styles.exportsLink}>
        <Button component="a" href="#/" variant="link" onClick={this.handleToggle}>
          <span style={styles.exportsIcon}>
            <AngleDoubleLeftIcon />
          </span>
          {intl.formatMessage(messages.ExportsTitle)}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportsLinkOwnProps, ExportsLinkStateProps>(state => {
  const isOpen = uiSelectors.selectIsExportsDrawerOpen(state);

  return {
    isOpen,
  };
});

const mapDispatchToProps: ExportsLinkDispatchProps = {
  closeExportDrawer: uiActions.closeExportsDrawer,
  openExportDrawer: uiActions.openExportsDrawer,
};

const ExportsLink = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportsLinkBase));

export { ExportsLink };
