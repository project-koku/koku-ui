import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { OcpCloudQuery, parseQuery } from 'api/ocpCloudQuery';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './emptyFilterState.styles';

interface EmptyFilterStateProps extends InjectedTranslateProps {
  filter?: string;
  icon?: string;
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

    if (filter) {
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
      return <img className={showAltIcon1 ? styles.icon1 : styles.icon2} />;
    } else {
      return <EmptyStateIcon icon={icon} />;
    }
  };

  return (
    <div
      className={css(
        styles.container,
        showMargin ? styles.containerMargin : ''
      )}
    >
      <EmptyState>
        {getIcon()}
        <Title size="lg">{title}</Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const EmptyFilterState = translate()(EmptyFilterStateBase);

export { EmptyFilterState };
