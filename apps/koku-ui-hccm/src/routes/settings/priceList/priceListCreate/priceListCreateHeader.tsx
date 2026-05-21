import { Breadcrumb, BreadcrumbItem, Button, Split, SplitItem, Title, TitleSizes } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

import { styles } from './priceListCreateHeader.styles';

interface PriceListCreateHeaderOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onCancel?: () => void;
  onCreate?: () => void;
  priceList?: PriceListData;
}

type PriceListCreateHeaderProps = PriceListCreateHeaderOwnProps;

const PriceListCreateHeader: React.FC<PriceListCreateHeaderProps> = ({
  canWrite,
  isDisabled,
  onCancel,
  onCreate,
  priceList,
}) => {
  const intl = useIntl();
  const location = useLocation();

  return (
    <>
      <div style={styles.headerContent}>
        <Breadcrumb style={styles.breadcrumb}>
          <BreadcrumbItem
            render={() => (
              <Link
                to={`${formatPath(routes.settings.path)}`}
                state={{
                  ...(location?.state || {}),
                  settingsState: {
                    activeTabKey: 1,
                  },
                }}
              >
                {intl.formatMessage(messages.priceList, { count: 1 })}
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{intl.formatMessage(messages.createPriceList)}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Split>
        <SplitItem style={styles.headerDescription}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.createPriceList)}
          </Title>
          {priceList?.description}
        </SplitItem>
        <SplitItem>
          <span style={styles.actions}>
            <Button isAriaDisabled={isDisabled || !canWrite} onClick={onCreate} variant="primary">
              {intl.formatMessage(messages.create)}
            </Button>
            <Button onClick={onCancel} variant="link">
              {intl.formatMessage(messages.cancel)}
            </Button>
          </span>
        </SplitItem>
      </Split>
    </>
  );
};

export { PriceListCreateHeader };
