import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { OcpOnAwsQuery, parseQuery } from 'api/ocpOnAwsQuery';
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
    const filterTest = val => val === atob('a29rdQ==');
    let showAltIcon = false;
    if (filter) {
      for (const val of filter.split(',')) {
        if (filterTest(val)) {
          showAltIcon = true;
          break;
        }
      }
    } else {
      const queryFromRoute = parseQuery<OcpOnAwsQuery>(location.search);
      if (queryFromRoute && queryFromRoute.group_by) {
        for (const values of Object.values(queryFromRoute.group_by)) {
          if (Array.isArray(values)) {
            for (const val of values) {
              if (filterTest(val)) {
                showAltIcon = true;
                break;
              }
            }
          } else {
            if (filterTest(values)) {
              showAltIcon = true;
              break;
            }
          }
        }
      }
    }
    if (showAltIcon) {
      return <img className={styles.icon} />;
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
