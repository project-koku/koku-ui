import UiVersion from '@koku-ui/ui-lib/components/page/uiVersion';
import { Card, CardBody } from '@patternfly/react-core';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { SourcesPage } from 'components/sources-page/SourcesPage';
import { getLocale, ignoreDefaultMessageError } from 'i18n/intl';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { sourcesStore } from 'redux/store';

// eslint-disable-next-line no-restricted-imports
import messages from '../../locales/data.json';

interface SourcesPageWrapperProps {
  canWrite?: boolean;
}

export const SourcesPageWrapper: React.FC<React.PropsWithChildren<SourcesPageWrapperProps>> = ({
  canWrite = false,
}) => {
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
        <ErrorBoundary>
          <Card>
            <CardBody>
              <SourcesPage canWrite={canWrite} />
              <UiVersion />
            </CardBody>
          </Card>
        </ErrorBoundary>
      </Provider>
    </IntlProvider>
  );
};

SourcesPageWrapper.displayName = 'SourcesPageWrapper';

export default SourcesPageWrapper;
