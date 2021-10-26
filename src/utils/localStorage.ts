import { getTokenCookie } from 'utils/cookie';

const costTypeID = 'cost_type';
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

// Returns true if session is valid
export const isSessionValid = () => {
  return getSessionToken() === getPartialTokenCookie();
};

// Save inactive sources token
export const saveSessionToken = () => {
  localStorage.setItem(sessionTokenID, getPartialTokenCookie());
};

/**
 * Cost type
 */

// eslint-disable-next-line no-shadow
export const enum CostTypes {
  amortized = 'savingsplan_effective_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

// Delete cost type
export const deleteCostType = () => {
  localStorage.removeItem(costTypeID);
};

// Returns cost type
export const getCostType = () => {
  const costType = localStorage.getItem(costTypeID);
  return costType ? costType : CostTypes.unblended;
};

// Invalidates cost type if current session is not valid
export const invalidateCostType = () => {
  if (!isSessionValid()) {
    deleteSessionToken();
    deleteCostType();
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

// Deletes currency
export const deleteCurrency = () => {
  localStorage.removeItem(currencyID);
};

// Returns currency
export const getCurrency = () => {
  const units = localStorage.getItem(currencyID);
  return units ? units : 'USD';
};

// Invalidates currency if current session is not valid
export const invalidateCurrency = () => {
  if (!isSessionValid()) {
    deleteSessionToken();
    deleteCurrency();
  }
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
