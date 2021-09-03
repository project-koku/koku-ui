/* eslint-disable no-restricted-imports */
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { createIntl, IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createStore } from 'redux';

import messages from '../locales/data.json';
import { RootState } from '../src/store';
import { rootReducer } from '../src/store/rootReducer';

const locale = 'en';
const intl = createIntl({
  defaultLocale: 'en',
  locale,
  messages: messages[locale],
});

export const renderWithReactIntl = (Component, state: Partial<RootState>) => {
  const store = createStore(rootReducer, state);
  const history = createMemoryHistory();

  return render(
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Provider store={store}>
        <Router history={history}>
          <Component intl={intl} />
        </Router>
      </Provider>
    </IntlProvider>
  );
};

const render = (ui, { locale = 'en', ...renderOptions } = {}) => {
  function Wrapper({ children }) {
    return (
      <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
