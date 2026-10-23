import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Card, CardBody, ExpandableSection, PageSection } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { getApiErrorDetail } from 'routes/utils/errorNotification';

interface NotAvailableOwnProps {
  error?: AxiosError;
  isPageSection?: boolean;
  title?: string;
}

type NotAvailableProps = NotAvailableOwnProps;

// Unavailable empty state shown when an API request fails on details, explorer, optimizations, settings, and permissions pages.
const NotAvailable: React.FC<NotAvailableProps> = ({ error, isPageSection = true, title }) => {
  const intl = useIntl();
  const detail = error ? getApiErrorDetail(error) : undefined;

  // Render

  const content = (
    <Card>
      <CardBody>
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
      </CardBody>
    </Card>
  );

  return (
    <>
      {title && <PageHeader title={title} />}
      {isPageSection ? <PageSection hasBodyWrapper={true}>{content}</PageSection> : content}
    </>
  );
};

export default NotAvailable;
