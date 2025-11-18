const accountCurrencyID = 'account_currency';
const accountNumberID = 'account_number';
const costManagementID = 'cost_management_ros';
const currencyID = 'currency';

/**
 * Common
 */
export const getStorage = () => {
  const s = sessionStorage.getItem(costManagementID);
  return s && s !== null ? JSON.parse(s) : undefined;
};

export const getItem = (id: string) => {
  const s = getStorage();
  return s ? s[id] : undefined;
};

export const removeItem = (id: string) => {
  const s = getStorage();
  if (s) {
    s[id] = undefined;
    sessionStorage.setItem(costManagementID, JSON.stringify(s));
  }
};

export const setItem = async (id: string, value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  let s = getStorage();
  if (!s) {
    const identity = await getUserIdentity();
    s = {
      [accountNumberID]: identity.account_number, // Save to invalidate session storage for new users
    };
  }
  s[id] = value;
  sessionStorage.setItem(costManagementID, JSON.stringify(s));
};

/**
 * Currency
 */

// Returns account currency
export const getAccountCurrency = () => {
  const units = getItem(accountCurrencyID);
  return units ? units : 'USD';
};

// Returns currency
export const getCurrency = () => {
  const units = getItem(currencyID);
  return units ? units : 'USD';
};

// Returns true if currency is available
export const isCurrencyAvailable = () => {
  const currency = getItem(currencyID);
  return currency && currency !== null;
};

// Set account currency
export const setAccountCurrency = (value: string) => {
  setItem(accountCurrencyID, value);
};

// Set currency
export const setCurrency = (value: string) => {
  setItem(currencyID, value);
};

/**
 * Session
 */

// Invalidates session storage if not valid and restores query param values
export const invalidateSession = (force = false) => {
  if (force) {
    sessionStorage.removeItem(costManagementID);
    return;
  }
  isSessionValid().then(valid => {
    if (!valid) {
      sessionStorage.removeItem(costManagementID);
    }
  });
};

// Returns true if session is valid
const isSessionValid = async () => {
  const accountNumber = getItem(accountNumberID);
  if (!accountNumber) {
    return true; // Don't clear
  }
  return getUserIdentity().then(identity => {
    return accountNumber === identity.account_number;
  });
};

/**
 * User
 */

// Returns user identity
const getUserIdentity = async () => {
  const insights = (window as any).insights;
  const user = await insights.chrome.auth.getUser();
  return user.identity;
};
