import messages from '@koku-ui/i18n/locales/messages';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { styles } from './noData.styles';

interface NoDataStateOwnProps {
  detailsComponent?: React.ReactNode;
  showReload?: boolean;
}

type NoDataStateProps = NoDataStateOwnProps & WrappedComponentProps;

class NoDataStateBase extends React.Component<NoDataStateProps, any> {
  public render() {
    const { detailsComponent, intl, showReload = true } = this.props;

    return (
      <EmptyState
        headingLevel="h5"
        icon={PlusCircleIcon}
        titleText={intl.formatMessage(messages.noDataStateTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>
          {intl.formatMessage(messages.noDataStateDesc, {
            status: detailsComponent ? <Bullseye style={styles.details}>{detailsComponent}</Bullseye> : '',
          })}
        </EmptyStateBody>
        <EmptyStateFooter>
          {showReload && (
            <Button variant="primary" onClick={() => window.location.reload()}>
              {intl.formatMessage(messages.noDataStateRefresh)}
            </Button>
          )}
        </EmptyStateFooter>
      </EmptyState>
    );
  }
}

const NoDataState = injectIntl(NoDataStateBase);

export { NoDataState };
