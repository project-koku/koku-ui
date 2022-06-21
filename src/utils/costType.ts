import { parseQuery, Query } from 'api/queries/query';
import { getCostType as getCostTypeFromLocaleStorage } from 'utils/localStorage';

// eslint-disable-next-line no-shadow
export const enum CostTypes {
  amortized = 'savingsplan_effective_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

// Returns cost type
export const getCostType = () => {
  const query = parseQuery<Query>(location.search);

  if (query.cost_type) {
    return query.cost_type;
  }
  switch (getCostTypeFromLocaleStorage()) {
    case 'blended_cost':
      return CostTypes.blended;
    case 'savingsplan_effective_cost':
      return CostTypes.amortized;
    case 'unblended_cost':
    default:
      return CostTypes.unblended;
  }
};
