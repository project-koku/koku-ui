import UiVersion from '@koku-ui/ui-lib/components/page/uiVersion';
import { Card, CardBody } from '@patternfly/react-core';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { getLocale, ignoreDefaultMessageError } from 'components/i18n';
import { SourcesPage } from 'components/sourcesPage/SourcesPage';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { sourcesStore } from 'redux/store';

// eslint-disable-next-line no-restricted-imports
import messages from '../../locales/data.json';

interface SourcesPageWrapperProps {
  canWrite?: boolean;
}

const SourcesPageWrapper: React.FC<SourcesPageWrapperProps> = ({ canWrite = false }) => {
  const locale = getLocale();
  const messagesByLocale = messages as Record<string, Record<string, string>>;

  return (
    <IntlProvider
      defaultLocale="en"
      locale={locale}
      messages={messagesByLocale[locale] || messagesByLocale.en}
      onError={ignoreDefaultMessageError}
    >
      <Provider store={sourcesStore as any}>
        <Card>
          <CardBody>
            <ErrorBoundary>
              <SourcesPage canWrite={canWrite} />
            </ErrorBoundary>
          </CardBody>
        </Card>
        <UiVersion />
      </Provider>
    </IntlProvider>
  );
};

export default SourcesPageWrapper;
