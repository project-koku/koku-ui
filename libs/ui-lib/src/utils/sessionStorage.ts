import { getUserIdentity } from '../init';
import { ComputedReportItemValueType } from '../routes/components/charts/common/chartDatum';

export const enum CostTypes {
  amortized = 'calculated_amortized_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

const accountCostTypeID = 'account_cost_type';
const accountCurrencyID = 'account_currency';
const accountNumberID = 'account_number';
const costDistributionID = 'cost_distribution';
const costManagementID = 'cost_management';
const costTypeID = 'cost_type';
const currencyID = 'currency';
const inactiveSourcesID = 'inactive_sources';
const operatorAvailableID = 'operator_available';

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
 * Cost distribution
 */

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
};

/**
 * Cost type
 */

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
};

// Set cost type
export const setCostType = (value: string) => {
  // Don't store undefined https://issues.redhat.com/browse/COST-3683
  if (!value) {
    return;
  }
  setItem(costTypeID, value);
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
};

/**
 * Operator available
 */

// Deletes operator available
export const deleteOperatorAvailable = () => {
  removeItem(operatorAvailableID);
};

// Returns operator available
export const getOperatorAvailable = () => {
  return getItem(operatorAvailableID);
};

// Returns true if operator available is valid for the current session
export const isOperatorAvailableValid = () => {
  return getOperatorAvailable() && isSessionValid();
};

// Set operator available
export const setOperatorAvailable = (value: string) => {
  setItem(operatorAvailableID, value);
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
