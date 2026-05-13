import {
  Alert,
  AlertActionCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  Content,
  ContentVariants,
  Split,
  SplitItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getCurrencyLabel } from 'routes/components/currency';
import { CostModelActions } from 'routes/settings/costModel/costModelBreakdown/components/actions';
import { formatPath } from 'utils/paths';

import { styles } from './costModelBreakdownHeader.styles';

interface CostModelBreakdownHeaderOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDisabled?: boolean;
  isRecalculating?: boolean;
  onAlertClose?: () => void;
  onClose?: () => void;
  onDelete?: (costModel: CostModel) => void;
  onEdit?: (costModel: CostModel) => void;
}

type CostModelBreakdownHeaderProps = CostModelBreakdownHeaderOwnProps;

const CostModelBreakdownHeader: React.FC<CostModelBreakdownHeaderProps> = ({
  canWrite,
  costModel,
  isDisabled,
  isRecalculating,
  onAlertClose,
  onClose,
  onDelete,
  onEdit,
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
                    activeTabKey: 0,
                  },
                }}
              >
                {intl.formatMessage(messages.costModels)}
              </Link>
            )}
          />
          <BreadcrumbItem isActive>{costModel?.name}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      {isRecalculating && (
        <div style={styles.alertContainer}>
          <Alert
            isInline
            actionClose={<AlertActionCloseButton onClose={onAlertClose} />}
            title={intl.formatMessage(messages.recalculateCharges)}
            variant="info"
          >
            <p>{intl.formatMessage(messages.costModelsRecalculateDesc)}</p>
          </Alert>
        </div>
      )}
      <Split>
        <SplitItem style={styles.headerDescription}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {costModel?.name}
          </Title>
          {costModel?.description}
        </SplitItem>
        <SplitItem>
          <span style={styles.actions}>
            <CostModelActions
              canWrite={canWrite}
              costModel={costModel}
              isDisabled={isDisabled}
              onClose={onClose}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </span>
        </SplitItem>
      </Split>
      <SplitItem>
        <div style={styles.currency}>
          <Content component={ContentVariants.dl}>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.lastUpdated)}</Content>
            <Content component={ContentVariants.dd}>
              {intl.formatDate(costModel?.updated_timestamp || '', {
                day: 'numeric',
                hour: 'numeric',
                hour12: false,
                minute: 'numeric',
                month: 'short',
                timeZone: 'UTC',
                timeZoneName: 'short',
                year: 'numeric',
              })}
            </Content>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.currency)}</Content>
            <Content component={ContentVariants.dd}>{getCurrencyLabel(costModel?.currency)}</Content>
          </Content>
        </div>
      </SplitItem>
    </>
  );
};

export { CostModelBreakdownHeader };
