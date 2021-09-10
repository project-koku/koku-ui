import { getTokenCookie } from 'utils/cookie';

const currencyTokenID = 'cost_currency_token';
const currencyUnitsID = 'cost_currency_units';
const inactiveSourcesTokenID = 'cost_inactive_sources';

// Returns a subset of the token cookie
export const getPartialTokenCookie = () => {
  const token = getTokenCookie();
  return token.substring(token.length - 40, token.length);
};

// Deletes currency token, used by isCurrencyTokenValid
export const deleteCurrencyToken = () => {
  localStorage.removeItem(currencyTokenID);
};

// Deletes currency units
export const deleteCurrencyUnits = () => {
  localStorage.removeItem(currencyUnitsID);
  deleteCurrencyToken(); // Delete token used by isCurrencyTokenValid
};

// Deletes inactive sources token
export const deleteInactiveSourcesToken = () => {
  localStorage.removeItem(inactiveSourcesTokenID);
};

// Returns currency token, used by isCurrencyTokenValid
export const getCurrencyToken = () => {
  return localStorage.getItem(currencyTokenID);
};

// Returns currency units
export const getCurrencyUnits = () => {
  const units = localStorage.getItem(currencyUnitsID);
  return units ? units : 'USD';
};

// Returns inactive sources token
export const getInactiveSourcesToken = () => {
  return localStorage.getItem(inactiveSourcesTokenID);
};

// Deletes currency units current session is not valid
export const invalidateCurrencyUnits = () => {
  if (!isCurrencyTokenValid()) {
    deleteCurrencyUnits();
  }
};

// Returns true if currency token is valid for current session
export const isCurrencyTokenValid = () => {
  return getCurrencyToken() === getPartialTokenCookie();
};

// Initialize inactive sources token, used by isInactiveSourcesTokenValid
export const initInactiveSourcesToken = () => {
  setInactiveSourcesToken(getPartialTokenCookie());
};

// Returns true if inactive sources token is valid for current session
export const isInactiveSourcesTokenValid = () => {
  return getInactiveSourcesToken() === getPartialTokenCookie();
};

// Set currency token, used by isCurrencyTokenValid
export const setCurrencyToken = value => {
  localStorage.setItem(currencyTokenID, value);
};

// Set currency units
export const setCurrencyUnits = value => {
  localStorage.setItem(currencyUnitsID, value);
  setCurrencyToken(getPartialTokenCookie()); // Save token used by isCurrencyTokenValid
};

// Set inactive sources token
export const setInactiveSourcesToken = value => {
  localStorage.setItem(inactiveSourcesTokenID, value);
};
