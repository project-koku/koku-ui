import './emptyFilterState.scss';

import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons/search-icon';
import { OcpCloudQuery, parseQuery } from 'api/queries/ocpCloudQuery';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface EmptyFilterStateProps extends WithTranslation {
  filter?: string;
  icon?: any;
  showMargin?: boolean;
  subTitle?: string;
  title?: string;
}

const EmptyFilterStateBase: React.SFC<EmptyFilterStateProps> = ({
  filter,
  icon = SearchIcon,
  showMargin = true,
  t,

  // destructure last
  subTitle = t('empty_filter_state.subtitle'),
  title = t('empty_filter_state.title'),
}) => {
  const getIcon = () => {
    const trim = (val: string) => val.replace(/\s+/g, '').toLowerCase();
    const filterTest1 = (val: string) => trim(val) === atob('a29rdQ==');
    const filterTest2 = (val: string) => trim(val) === atob('cmVkaGF0');
    let showAltIcon1 = false;
    let showAltIcon2 = false;

    if (filter && !Array.isArray(filter)) {
      for (const val of filter.split(',')) {
        if (filterTest1(val)) {
          showAltIcon1 = true;
          break;
        }
        if (filterTest2(val)) {
          showAltIcon2 = true;
          break;
        }
      }
    } else {
      const queryFromRoute = parseQuery<OcpCloudQuery>(location.search);
      if (queryFromRoute && queryFromRoute.group_by) {
        for (const values of Object.values(queryFromRoute.group_by)) {
          if (Array.isArray(values)) {
            for (const val of values) {
              if (filterTest1(val)) {
                showAltIcon1 = true;
                break;
              }
              if (filterTest2(val)) {
                showAltIcon2 = true;
                break;
              }
            }
          } else {
            if (filterTest1(values)) {
              showAltIcon1 = true;
              break;
            }
            if (filterTest2(values)) {
              showAltIcon2 = true;
              break;
            }
          }
        }
      }
    }
    if (showAltIcon1 || showAltIcon2) {
      return <img className={showAltIcon1 ? 'icon1' : 'icon2'} />;
    } else {
      return <EmptyStateIcon icon={icon} />;
    }
  };

  return (
    <div className={['container', showMargin ? 'containerMargin' : {}].join('')}>
      <EmptyState>
        {getIcon()}
        <Title headingLevel="h2" size="lg">
          {title}
        </Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const EmptyFilterState = withTranslation()(EmptyFilterStateBase);

export { EmptyFilterState };
