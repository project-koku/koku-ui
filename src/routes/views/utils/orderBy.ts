import type { Query } from 'api/queries/query';

export const getOrderById = (query: Query) => {
  const orderBys = query && query.order_by ? Object.keys(query.order_by) : [];
  return orderBys.find(key => key !== undefined);
};

export const getOrderByValue = (query: Query) => {
  const orderById = getOrderById(query);
  return orderById ? query.order_by[orderById] : undefined;
};
