const accountCurrencyID = 'cost_management_account_currency';
const costTypeID = 'cost_management_cost_type';
const currencyID = 'cost_management_currency';
const inactiveSourcesID = 'cost_management_inactive_sources';
const sessionTokenID = 'cost_management_session';

// Returns a subset of the token cookie
export const getPartialToken = async () => {
  const insights = (window as any).insights;
  const token = await insights.chrome.auth.getToken();
  return token.substring(token.length - 40, token.length);
};

/**
 * Session
 */

// Deletes session token
export const deleteSessionToken = () => {
  localStorage.removeItem(sessionTokenID);
};

// Returns session token
export const getSessionToken = () => {
  return localStorage.getItem(sessionTokenID);
};

// Invalidates session if not valid and restores query param values
export const invalidateSession = (force = false) => {
  if (!isSessionValid() || force) {
    deleteSessionToken();

    // Delete cost type
    deleteCostType();

    // Delete currency
    deleteAccountCurrency();
    deleteCurrency();
  }
};

// Returns true if session is valid
export const isSessionValid = async () => {
  const partialToken = await getPartialToken();
  return getSessionToken() === partialToken;
};

// Save partial session token
export const saveSessionToken = async () => {
  const partialToken = await getPartialToken();
  localStorage.setItem(sessionTokenID, partialToken);
};

/**
 * Cost type
 */

// Delete cost type
export const deleteCostType = () => {
  localStorage.removeItem(costTypeID);
};

// Returns cost type
export const getCostType = () => {
  const costType = localStorage.getItem(costTypeID);
  return costType && costType !== null ? costType : undefined;
};

// Returns true if cost type is available
export const isCostTypeAvailable = () => {
  const costType = localStorage.getItem(costTypeID);
  return costType && costType !== null;
};

// Set cost type
export const setCostType = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  localStorage.setItem(costTypeID, value);
  saveSessionToken();
};

/**
 * Currency
 */

// Deletes account currency
export const deleteAccountCurrency = () => {
  localStorage.removeItem(accountCurrencyID);
};

// Deletes currency
export const deleteCurrency = () => {
  localStorage.removeItem(currencyID);
};

// Returns account currency
export const getAccountCurrency = () => {
  const units = localStorage.getItem(accountCurrencyID);
  return units ? units : 'USD';
};

// Returns currency
export const getCurrency = () => {
  const units = localStorage.getItem(currencyID);
  return units ? units : 'USD';
};

// Returns true if currency is available
export const isCurrencyAvailable = () => {
  const currency = localStorage.getItem(currencyID);
  return currency && currency !== null;
};

// Set account currency
export const setAccountCurrency = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  localStorage.setItem(accountCurrencyID, value);
  saveSessionToken();
};

// Set currency
export const setCurrency = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  localStorage.setItem(currencyID, value);
  saveSessionToken();
};

/**
 * Inactive sources
 */

// Deletes inactive sources
export const deleteInactiveSources = () => {
  localStorage.removeItem(inactiveSourcesID);
};

// Returns inactive sources
export const getInactiveSources = () => {
  return localStorage.getItem(inactiveSourcesID);
};

// Invalidates inactive sources if current session is not valid
export const invalidateInactiveSources = () => {
  if (!isSessionValid()) {
    deleteSessionToken();
    deleteInactiveSources();
  }
};

// Returns true if inactive sources is valid for the current session
export const isInactiveSourcesValid = () => {
  return getInactiveSources() && isSessionValid();
};

// Set inactive sources
export const setInactiveSources = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  localStorage.setItem(inactiveSourcesID, value);
  saveSessionToken();
};
