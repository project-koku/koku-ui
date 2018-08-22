import { RootState } from '../rootReducer';
import { accountWizardStateKey } from './accountWizardReducer';

export const selectAccountWizardState = (state: RootState) => {
  const test = state[accountWizardStateKey];
  console.log('TEST: ' + accountWizardStateKey);
  return test;
};
