// import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
// import type { Query } from 'api/queries/query';
// import { parseQuery } from 'api/queries/query';
// import messages from 'locales/messages';
import React from 'react';
// import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
// import { routes } from 'routes';
// import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { getQueryState } from 'routes/utils/queryState';
// import { formatPath } from 'utils/paths';

interface InstancesOwnProps {
  // TBD...
}

type InstancesProps = InstancesOwnProps;

// const useQueryFromRoute = () => {
//   const location = useLocation();
//   return parseQuery<Query>(location.search);
// };

const useQueryState = () => {
  const location = useLocation();
  return getQueryState(location, 'details');
};

const Instances: React.FC<InstancesProps> = () => {
  // const intl = useIntl();
  // const location = useLocation();
  // const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();

  // const groupBy = getGroupById(queryFromRoute);
  // const groupByValue = getGroupByValue(queryFromRoute);
  // const otimizationsTab = location.search.indexOf('optimizationsTab') === -1 ? '&optimizationsTab=true' : '';

  const tagsFilter = queryState?.filter_by?.tags ? queryState.filter_by.tags : null;

  return <>Hello{tagsFilter}</>;
};

export { Instances };
