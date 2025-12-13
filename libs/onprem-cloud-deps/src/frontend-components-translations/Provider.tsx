import React from 'react';
import type { IntlConfig } from 'react-intl';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

const IntlProvider: React.ComponentType<React.PropsWithChildren<IntlConfig>> = props => (
  <ReactIntlProvider {...props} />
);

export default IntlProvider;
