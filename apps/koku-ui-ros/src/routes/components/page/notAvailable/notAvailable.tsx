import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { ExpandableSection, PageSection } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { getApiErrorDetail } from 'routes/utils/errorNotification';

interface NotAvailableOwnProps {
  error?: AxiosError;
  title?: string;
}

type NotAvailableProps = NotAvailableOwnProps;

// Unavailable empty state shown when an API request fails on optimizations and permissions pages.
const NotAvailable: React.FC<NotAvailableProps> = ({ error, title }) => {
  const intl = useIntl();
  const detail = error ? getApiErrorDetail(error) : undefined;

  // Render

  return (
    <>
      {title && <PageHeader title={title} />}
      <PageSection hasBodyWrapper={false}>
        <Unavailable
          bodyText={
            detail ? (
              <>
                {intl.formatMessage(messages.notAvailableDesc)}
                <ExpandableSection
                  toggleTextCollapsed={intl.formatMessage(messages.showDetails)}
                  toggleTextExpanded={intl.formatMessage(messages.hideDetails)}
                >
                  {detail}
                </ExpandableSection>
              </>
            ) : undefined
          }
        />
      </PageSection>
    </>
  );
};

export default NotAvailable;
