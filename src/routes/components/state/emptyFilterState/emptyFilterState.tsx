import { MessageDescriptor } from '@formatjs/intl/src/types';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, TitleSizes } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { OcpCloudQuery, parseQuery } from 'api/queries/ocpCloudQuery';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

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
  const ImgScroll = () => {
    const imgs = [styles.icon2, styles.icon3, styles.icon4, styles.icon5, styles.icon6];
    const [index, setIndex] = useState(imgs.length - 1);

    useEffect(() => {
      if (index > 0) {
        setTimeout(() => {
          setIndex(index - 1);
        }, 1000);
      }
    });
    return <img style={imgs[index]} />;
  };

  const getIcon = () => {
    const trim = (val: string) => val.replace(/\s+/g, '').toLowerCase();
    const filterTest1 = (val: string) => trim(val) === atob('cmVkaGF0');
    const filterTest2 = (val: string) => trim(val) === atob('a29rdQ==');
    let showAltIcon1 = false;
    let showAltIcon2 = false;

    if (filter && filter.length && !Array.isArray(filter)) {
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
    if (showAltIcon1) {
      return <img style={styles.icon1} />;
    } else if (showAltIcon2) {
      return <ImgScroll />;
    } else {
      return <EmptyStateIcon icon={icon} />;
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(showMargin ? styles.containerMargin : {}),
      }}
    >
      <EmptyState>
        {getIcon()}
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(title)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(subTitle)}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const EmptyFilterState = injectIntl(EmptyFilterStateBase);

export default EmptyFilterState;
