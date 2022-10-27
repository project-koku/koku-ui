import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import { getCurrency as getCurrencyFromLocaleStorage } from 'utils/localStorage';

// Returns cost type
export const getCurrency = () => {
  const query = parseQuery<Query>(location.search);
  return query.currency ? query.currency : getCurrencyFromLocaleStorage();
};
