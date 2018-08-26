import * as accountActions from './accountActions';
import * as systemConfigActions from './systemConfigActions';

const actions = {
  account: accountActions,
  systemConfig: systemConfigActions,
};

const reduxActions = { ...actions };

export {
  reduxActions as default,
  reduxActions,
  accountActions,
  systemConfigActions,
};
