import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import HookIntoProps from 'hook-into-props';
import { useTranslation } from 'react-i18next';

import EmptyStateBase from './emptyStateBase';

const NoMatchFound = HookIntoProps(() => {
  const { t } = useTranslation();
  return {
    title: t('empty_filter_state.title'),
    description: t('empty_filter_state.subtitle'),
    icon: SearchIcon,
  };
})(EmptyStateBase);

export default NoMatchFound;
