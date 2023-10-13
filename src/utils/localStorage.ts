import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { CostTypes } from 'routes/components/costType/costType';

const accountCostTypeID = 'account_cost_type';
const accountCurrencyID = 'account_currency';
const costDistributionID = 'cost_distribution';
const costManagementID = 'cost_management';
const costTypeID = 'costType';
const currencyID = 'currency';
const inactiveSourcesID = 'inactive_sources';
const sessionTokenID = 'session';

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
  removeItem(sessionTokenID);
};

// Returns session token
export const getSessionToken = () => {
  return getItem(sessionTokenID);
};

// Invalidates session if not valid and restores query param values
export const invalidateSession = (force = false) => {
  if (force) {
    localStorage.removeItem(costManagementID);
    return;
  }
  isSessionValid().then(valid => {
    if (!valid) {
      localStorage.removeItem(costManagementID);
    }
  });
};

// Returns true if session is valid
export const isSessionValid = async () => {
  const token = getSessionToken();
  if (!token) {
    return true; // Don't clear
  }
  return getPartialToken().then(partialToken => {
    return token === partialToken;
  });
};

// Save partial session token
export const saveSessionToken = async () => {
  const partialToken = await getPartialToken();
  setItem(sessionTokenID, partialToken);
};

/**
 * Common
 */
export const getStorage = () => {
  const s = localStorage.getItem(costManagementID);
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
    localStorage.setItem(costManagementID, JSON.stringify(s));
  }
};

export const setItem = (id: string, value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  let s = getStorage();
  if (!s) {
    s = {};
  }
  s[id] = value;
  localStorage.setItem(costManagementID, JSON.stringify(s));
};

/**
 * Cost distribution
 */

// Delete cost distribution
export const deleteCostDistribution = () => {
  removeItem(costDistributionID);
};

// Returns cost distribution
export const getCostDistribution = () => {
  const costDistribution = getItem(costDistributionID);
  return costDistribution && costDistribution !== null ? costDistribution : ComputedReportItemValueType.distributed;
};

// Returns true if cost distribution is available
export const isCostDistributionAvailable = () => {
  const costDistribution = getItem(costDistributionID);
  return costDistribution && costDistribution !== null;
};

// Set cost distribution
export const setCostDistribution = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  setItem(costDistributionID, value);
  saveSessionToken();
};

/**
 * Cost type
 */

// Delete cost type
export const deleteCostType = () => {
  removeItem(costTypeID);
};

// Returns account cost type
export const getAccountCostType = () => {
  const costType = getItem(accountCostTypeID);
  return costType ? costType : undefined;
};

// Returns cost type
export const getCostType = () => {
  const costType = getItem(costTypeID);
  return costType && costType !== null ? costType : CostTypes.unblended;
};

// Returns true if cost type is available
export const isCostTypeAvailable = () => {
  const costType = getItem(costTypeID);
  return costType && costType !== null;
};

// Set account currency
export const setAccountCostType = (value: string) => {
  setItem(accountCostTypeID, value);
  saveSessionToken();
};

// Set cost type
export const setCostType = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  setItem(costTypeID, value);
  saveSessionToken();
};

/**
 * Currency
 */

// Deletes account currency
export const deleteAccountCurrency = () => {
  removeItem(accountCurrencyID);
};

// Deletes currency
export const deleteCurrency = () => {
  removeItem(currencyID);
};

// Returns account currency
export const getAccountCurrency = () => {
  const units = getItem(accountCurrencyID);
  return units ? units : undefined;
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
  saveSessionToken();
};

// Set currency
export const setCurrency = (value: string) => {
  setItem(currencyID, value);
  saveSessionToken();
};

/**
 * Inactive sources
 */

// Deletes inactive sources
export const deleteInactiveSources = () => {
  removeItem(inactiveSourcesID);
};

// Returns inactive sources
export const getInactiveSources = () => {
  return getItem(inactiveSourcesID);
};

// Returns true if inactive sources is valid for the current session
export const isInactiveSourcesValid = () => {
  return getInactiveSources() && isSessionValid();
};

// Set inactive sources
export const setInactiveSources = (value: string) => {
  setItem(inactiveSourcesID, value);
  saveSessionToken();
};
