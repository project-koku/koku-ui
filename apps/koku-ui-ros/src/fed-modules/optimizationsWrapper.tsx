/* eslint-disable no-console */
import UiVersion from '@koku-ui/ui-lib/components/page/uiVersion';
import { getLocale } from 'components/i18n';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { rosStore } from 'store';

// eslint-disable-next-line no-restricted-imports
import messages from '../../locales/data.json';

export interface OptimizationsWrapperOwnProps {
  children?: React.ReactNode;
}

type OptimizationsWrapperProps = OptimizationsWrapperOwnProps;

const OptimizationsWrapper: React.FC<OptimizationsWrapperProps> = ({ children }: OptimizationsWrapperOwnProps) => {
  const locale = getLocale();

  // Note: className is a workaround for ConsoleDot outputting the app name instead of module name
  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale] || messages.en} onError={console.log}>
      <Provider store={rosStore as any}>
        <div className="costManagementRos">{children}</div>
        <UiVersion />
      </Provider>
    </IntlProvider>
  );
};

export { OptimizationsWrapper };
