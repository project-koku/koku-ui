import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { OcpOnAwsQuery, parseQuery } from 'api/ocpOnAwsQuery';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './emptyFilterState.styles';

interface EmptyFilterStateProps extends InjectedTranslateProps {
  showAltIcon?: boolean;
  icon?: React.ReactNode;
}

const EmptyFilterStateBase: React.SFC<EmptyFilterStateProps> = ({
  icon = ExclamationTriangleIcon,
  t,
}) => {
  const queryFromRoute = parseQuery<OcpOnAwsQuery>(location.search);
  const testVal = val => val === 'koku';
  let showAltIcon = false;
  for (const values of Object.values(queryFromRoute.group_by)) {
    if (Array.isArray(values)) {
      for (const val of values) {
        if (testVal(val)) {
          showAltIcon = true;
          break;
        }
      }
    } else {
      if (testVal(values)) {
        showAltIcon = true;
        break;
      }
    }
  }
  return (
    <EmptyState>
      {Boolean(showAltIcon) ? (
        <img className={styles.icon} />
      ) : (
        <EmptyStateIcon icon={icon} />
      )}
      <EmptyStateBody>{t('empty_filter_state.subtitle')}</EmptyStateBody>
    </EmptyState>
  );
};

const EmptyFilterState = translate()(EmptyFilterStateBase);

export { EmptyFilterState };
