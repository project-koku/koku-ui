import { getQueryRoute, Query } from 'api/queries/query';
import { breakdownDescKey, breakdownTitleKey, orgUnitIdKey } from 'api/queries/query';

export const getBreakdownPath = ({
  basePath,
  label,
  description,
  groupBy,
  query,
}: {
  basePath: string;
  label: string;
  description: string;
  groupBy: string | number;
  query: Query;
}) => {
  const newQuery = {
    ...query,
    ...(description && description !== label && { [breakdownDescKey]: description }),
    group_by: {
      [groupBy]: label,
    },
  };
  return `${basePath}?${getQueryRoute(newQuery)}`;
};

export const getOrgBreakdownPath = ({
  basePath,
  description,
  groupBy,
  groupByOrg,
  id,
  orgUnitId,
  query,
  title,
  type,
}: {
  basePath: string;
  description: string | number; // Used to display a description in the breakdown header
  groupBy: string | number;
  groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
  id: string | number; // group_by[account]=<id> param in the breakdown page
  orgUnitId: string | number; // Used to navigate back to details page
  query: Query;
  title: string | number; // Used to display a title in the breakdown header
  type: string; // account or organizational_unit
}) => {
  const newQuery = {
    ...JSON.parse(JSON.stringify(query)),
    ...(description && description !== title && { [breakdownDescKey]: description }),
    ...(title && { [breakdownTitleKey]: title }),
    ...(groupByOrg && orgUnitId && { [orgUnitIdKey]: orgUnitId }),
    group_by: {
      [groupBy]: id, // This may be overridden below
    },
  };
  if (!newQuery.filter) {
    newQuery.filter = {};
  }
  if (type === 'account') {
    newQuery.filter.account = id;
    newQuery.group_by = {
      [orgUnitIdKey]: groupByOrg,
    };
  } else if (type === 'organizational_unit') {
    newQuery.group_by = {
      [orgUnitIdKey]: id,
    };
  }
  return `${basePath}?${getQueryRoute(newQuery)}`;
};
