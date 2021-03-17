import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/js/icons/file-invoice-dollar-icon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface NoDataStateOwnProps {
  showReload?: boolean;
}

type NoDataStateProps = NoDataStateOwnProps & WithTranslation & RouteComponentProps<void>;

class NoDataStateBase extends React.Component<NoDataStateProps> {
  public render() {
    const { showReload = true, t } = this.props;

    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={FileInvoiceDollarIcon} />
        <Title headingLevel="h5" size="lg">
          {t('no_data_state.title')}
        </Title>
        <EmptyStateBody>{t('no_data_state.desc')}</EmptyStateBody>
        {showReload && (
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('no_data_state.refresh')}
          </Button>
        )}
      </EmptyState>
    );
  }
}

const NoDataState = withRouter(withTranslation()(NoDataStateBase));

export { NoDataState };
