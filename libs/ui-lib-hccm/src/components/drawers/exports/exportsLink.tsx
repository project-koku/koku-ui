import messages from '@koku-ui/i18n/locales/messages';
import { AlertActionLink, Button } from '@patternfly/react-core';
import { AngleDoubleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { uiSelectors } from '../../../store/ui';
import { uiActions } from '../../../store/ui';
import { styles } from './exports.styles';

interface ExportsLinkOwnProps {
  isActionLink?: boolean;
  onClick?: (isOpen: boolean) => void;
}

interface ExportsLinkStateProps {
  isOpen?: boolean;
}

interface ExportsLinkDispatchProps {
  closeExportDrawer: typeof uiActions.closeExportsDrawer;
  openExportDrawer: typeof uiActions.openExportsDrawer;
}

type ExportsLinkProps = ExportsLinkOwnProps & ExportsLinkStateProps & ExportsLinkDispatchProps & WrappedComponentProps;

class ExportsLinkBase extends React.Component<ExportsLinkProps, any> {
  private handleToggle = event => {
    const { closeExportDrawer, isOpen, onClick, openExportDrawer } = this.props;

    if (isOpen) {
      closeExportDrawer();
    } else {
      openExportDrawer();
    }
    event.preventDefault();

    if (onClick) {
      onClick(isOpen);
    }
    return false;
  };

  public render() {
    const { intl, isActionLink } = this.props;

    // @redhat-cloud-services/frontend-components-notifications does not expose PatternFly's actionLinks prop
    if (isActionLink) {
      return (
        <div className="pf-v6-c-alert__action-group">
          <AlertActionLink onClick={this.handleToggle}>{intl.formatMessage(messages.exportsTitle)}</AlertActionLink>
        </div>
      );
    }
    return (
      <div style={styles.exportsLink}>
        <Button variant="link" onClick={this.handleToggle}>
          <span style={styles.exportsIcon}>
            <AngleDoubleLeftIcon />
          </span>
          {intl.formatMessage(messages.exportsTitle)}
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

export default ExportsLink;
