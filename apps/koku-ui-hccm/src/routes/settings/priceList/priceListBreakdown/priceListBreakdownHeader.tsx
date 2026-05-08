import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant,
  Content,
  ContentVariants,
  Label,
  Split,
  SplitItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getCurrencyLabel } from 'routes/components/currency';
import { PriceListActions } from 'routes/settings/priceList/components/actions';
import { EditDetailsModal } from 'routes/settings/priceList/components/details';
import { getDateString, getValidityPeriod } from 'utils/dates';
import { formatPath } from 'utils/paths';

import { styles } from './priceListBreakdownHeader.styles';

interface PriceListBreakdownHeaderOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
  priceList?: PriceListData;
}

type PriceListBreakdownHeaderProps = PriceListBreakdownHeaderOwnProps;

const PriceListBreakdownHeader: React.FC<PriceListBreakdownHeaderProps> = ({
  canWrite,
  isDisabled,
  onClose,
  onDelete,
  onDeprecate,
  onDuplicate,
  onEdit,
  priceList,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOnEditModalClick = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleOnEditModalSuccess = () => {
    setIsEditModalOpen(false);
    onEdit?.();
  };

  return (
    <>
      <EditDetailsModal
        isOpen={isEditModalOpen}
        onClose={handleOnEditModalClose}
        onSuccess={handleOnEditModalSuccess}
        priceList={priceList}
      />
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
                {intl.formatMessage(messages.priceList)}
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{priceList?.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Split>
        <SplitItem style={styles.headerDescription}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {priceList?.name}
            {priceList?.enabled === false && (
              <Label isCompact style={styles.label}>
                {intl.formatMessage(messages.deprecated)}
              </Label>
            )}
            <Label isCompact style={styles.label}>
              {intl.formatMessage(messages.version, { value: priceList?.version })}
            </Label>
          </Title>
          {priceList?.description}
        </SplitItem>
        <SplitItem>
          <span style={styles.actions}>
            <Button isAriaDisabled={isDisabled} onClick={handleOnEditModalClick} variant={ButtonVariant.secondary}>
              {intl.formatMessage(messages.editDetails)}
            </Button>
            <PriceListActions
              canWrite={canWrite}
              isDisabled={isDisabled}
              onClose={onClose}
              onDelete={onDelete}
              onDeprecate={onDeprecate}
              onDuplicate={onDuplicate}
              priceList={priceList}
            />
          </span>
        </SplitItem>
      </Split>
      <Content style={styles.currency}>
        <Content component={ContentVariants.dl}>
          <Content component={ContentVariants.dt}>{intl.formatMessage(messages.validityPeriod)}</Content>
          <Content component={ContentVariants.dd}>
            {getValidityPeriod(
              priceList?.effective_start_date ? priceList.effective_start_date + 'T00:00:00' : '',
              priceList?.effective_end_date ? priceList.effective_end_date + 'T00:00:00' : ''
            )}
          </Content>
          <Content component={ContentVariants.dt}>{intl.formatMessage(messages.lastUpdated)}</Content>
          <Content component={ContentVariants.dd}>{getDateString(priceList?.updated_timestamp || '')}</Content>
          <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
          <Content component={ContentVariants.dd}>{getCurrencyLabel(priceList?.currency)}</Content>
        </Content>
      </Content>
    </>
  );
};

export { PriceListBreakdownHeader };
