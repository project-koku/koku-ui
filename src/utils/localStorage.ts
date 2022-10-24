import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import { getTokenCookie } from 'utils/cookie';

const accountCurrencyID = 'cost_management_account_currency';
const costTypeID = 'cost_management_cost_type';
const currencyID = 'cost_management_currency';
const inactiveSourcesID = 'cost_management_inactive_sources';
const sessionTokenID = 'cost_management_session';

// Returns a subset of the token cookie
export const getPartialTokenCookie = () => {
  const token = getTokenCookie();
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
export const invalidateSession = () => {
  if (!isSessionValid()) {
    deleteSessionToken();

    // Delete cost type
    deleteCostType();

    // Delete currency
    deleteAccountCurrency();
    deleteCurrency();
  }
};

// Returns true if session is valid
export const isSessionValid = () => {
  return getSessionToken() === getPartialTokenCookie();
};

// Save partial session token
export const saveSessionToken = () => {
  localStorage.setItem(sessionTokenID, getPartialTokenCookie());
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

// Restore cost type from query param if available
export const restoreCostType = () => {
  const queryFromRoute = parseQuery<Query>(location.search);

  if (queryFromRoute.cost_type) {
    setCostType(queryFromRoute.cost_type);
  }
};

// Set cost type
export const setCostType = (value: string) => {
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

// Restore currency from query param if available
export const restoreCurrency = () => {
  const queryFromRoute = parseQuery<Query>(location.search);

  if (queryFromRoute.currency) {
    setCurrency(queryFromRoute.currency);
  }
};

// Set account currency
export const setAccountCurrency = (value: string) => {
  localStorage.setItem(accountCurrencyID, value);
  saveSessionToken();
};

// Set currency
export const setCurrency = (value: string) => {
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
  localStorage.setItem(inactiveSourcesID, value);
  saveSessionToken();
};
