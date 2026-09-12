import UiVersion from '@koku-ui/ui-lib/components/page/uiVersion';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { SourceDetail } from 'components/sources-detail/SourceDetail';
import { getLocale, ignoreDefaultMessageError } from 'i18n/intl';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { sourcesStore } from 'redux/store';

// eslint-disable-next-line no-restricted-imports
import messages from '../../locales/data.json';

interface SourceDetailWrapperProps {
  canWrite?: boolean;
  onBack: () => void;
  uuid: string;
}

export const SourceDetailWrapper: React.FC<React.PropsWithChildren<SourceDetailWrapperProps>> = ({
  canWrite = false,
  onBack,
  uuid,
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
          <SourceDetail canWrite={canWrite} onBack={onBack} uuid={uuid} />
          <UiVersion />
        </ErrorBoundary>
      </Provider>
    </IntlProvider>
  );
};

SourceDetailWrapper.displayName = 'SourceDetailWrapper';

export default SourceDetailWrapper;
