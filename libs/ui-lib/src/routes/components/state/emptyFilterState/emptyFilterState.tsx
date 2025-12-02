import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { Query } from '@koku-ui/api/queries/query';
import { parseQuery } from '@koku-ui/api/queries/query';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Bullseye, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import React, { useEffect, useState } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { styles } from './emptyFilterState.styles';

interface EmptyFilterStateProps extends WrappedComponentProps {
  filter?: string;
  icon?: any;
  showMargin?: boolean;
  subTitle?: MessageDescriptor;
  title?: MessageDescriptor;
}

const EmptyFilterStateBase: React.FC<EmptyFilterStateProps> = ({
  filter,
  icon = SearchIcon,
  intl = defaultIntl, // Default required for testing
  showMargin = true,

  // destructure last
  subTitle = messages.emptyFilterStateSubtitle,
  title = messages.emptyFilterStateTitle,
}) => {
  const location = useLocation();

  const ItemScroll = () => {
    const items = [styles.item2, styles.item3, styles.item4, styles.item5, styles.item6];
    const [index, setIndex] = useState(items.length - 1);

    useEffect(() => {
      if (index > 0) {
        setTimeout(() => {
          setIndex(index - 1);
        }, 1000);
      }
    });
    return (
      <Bullseye style={styles.scrollContainer}>
        <img style={items[index]} />
      </Bullseye>
    );
  };

  const getItem = () => {
    const trim = (val: string) => val.replace(/\s+/g, '').toLowerCase();
    const isFilter1 = (val: string) => trim(val) === window.atob('cmVkaGF0');
    const isFilter2 = (val: string) => trim(val) === window.atob('a29rdQ==');
    let showEmptyState1 = false;
    let showEmptyState2 = false;

    if (filter && Array.isArray(filter)) {
      for (const val of filter) {
        if (isFilter1(val)) {
          showEmptyState1 = true;
          break;
        }
        if (isFilter2(val)) {
          showEmptyState2 = true;
          break;
        }
      }
    } else if (filter && !Array.isArray(filter)) {
      for (const val of filter.split(',')) {
        if (isFilter1(val)) {
          showEmptyState1 = true;
          break;
        }
        if (isFilter2(val)) {
          showEmptyState2 = true;
          break;
        }
      }
    } else {
      const queryFromRoute = parseQuery<Query>(location.search);
      if (queryFromRoute?.group_by) {
        for (const values of Object.values(queryFromRoute.group_by)) {
          if (Array.isArray(values)) {
            for (const val of values) {
              if (isFilter1(val)) {
                showEmptyState1 = true;
                break;
              }
              if (isFilter2(val)) {
                showEmptyState2 = true;
                break;
              }
            }
          } else {
            if (isFilter1(values as string)) {
              showEmptyState1 = true;
              break;
            }
            if (isFilter2(values as string)) {
              showEmptyState2 = true;
              break;
            }
          }
        }
      }
    }
    if (showEmptyState1) {
      return <img style={styles.item1} />;
    } else if (showEmptyState2) {
      return <ItemScroll />;
    } else {
      return null;
    }
  };

  const item = getItem();

  return (
    <div
      style={{
        ...styles.container,
        ...(showMargin ? styles.containerMargin : {}),
      }}
    >
      <EmptyState headingLevel="h2" icon={!item ? icon : undefined} titleText={intl.formatMessage(title)}>
        {item}
        <EmptyStateBody>{intl.formatMessage(subTitle)}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const EmptyFilterState = injectIntl(EmptyFilterStateBase);

export default EmptyFilterState;
