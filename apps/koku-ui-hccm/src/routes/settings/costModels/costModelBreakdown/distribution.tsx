import { Button, ButtonVariant, Card, CardBody, CardHeader, Title, TitleSizes } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { rbacSelectors } from 'store/rbac';

import { styles } from './costCalc.styles';
import UpdateDistributionDialog from './updateDistributionDialog';

interface Props {
  current: CostModel;
  isGpuToggleEnabled?: boolean;
  isUpdateDialogOpen: boolean;
  isWritePermission: boolean;
  setCostModelDialog: typeof costModelsActions.setCostModelDialog;
}

const DistributionCardBase: React.FC<Props> = ({
  current,
  isGpuToggleEnabled,
  isUpdateDialogOpen,
  isWritePermission,
  setCostModelDialog,
}) => {
  const intl = useIntl();

  return (
    <>
      {isUpdateDialogOpen && <UpdateDistributionDialog current={current} />}
      <Card style={styles.card}>
        <CardHeader
          actions={{
            actions: (
              <ReadOnlyTooltip key="edit" isDisabled={!isWritePermission}>
                <Button
                  aria-label={intl.formatMessage(messages.costModelsDistributionEdit)}
                  isAriaDisabled={!isWritePermission}
                  onClick={() => setCostModelDialog({ isOpen: true, name: 'updateDistribution' })}
                  variant={ButtonVariant.link}
                >
                  {intl.formatMessage(messages.edit)}
                </Button>
              </ReadOnlyTooltip>
            ),
            hasNoOffset: false,
            className: undefined,
          }}
        >
          <Title headingLevel="h2" size={TitleSizes.md}>
            {intl.formatMessage(messages.costDistribution)}
          </Title>
        </CardHeader>
        <CardBody style={styles.cardDescription}>{intl.formatMessage(messages.costModelsDistributionDesc)}</CardBody>
        <CardBody isFilled />
        <CardBody style={styles.cardBody}>
          <div>
            {intl.formatMessage(messages.distributionTypeDesc, {
              type: current.distribution_info.distribution_type,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributePlatformCosts, {
              value: current.distribution_info.platform_cost,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeUnallocatedCapacity, {
              value: current.distribution_info.worker_cost,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: current.distribution_info.network_unattributed || false,
              type: 'network',
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: current.distribution_info.storage_unattributed || false,
              type: 'storage',
            })}
          </div>
          {isGpuToggleEnabled && (
            <div>
              {intl.formatMessage(messages.distributeGpuCosts, {
                value: current.distribution_info.gpu_unallocated || false,
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default connect(
  createMapStateToProps(state => {
    const { updateDistribution } = costModelsSelectors.isDialogOpen(state)('distribution');
    return {
      costModelDialog: costModelsSelectors.isDialogOpen(state)('distribution'),
      isGpuToggleEnabled: FeatureToggleSelectors.selectIsGpuToggleEnabled(state),
      isUpdateDialogOpen: updateDistribution,
      isWritePermission: rbacSelectors.isCostModelWritePermission(state),
    };
  }),
  {
    setCostModelDialog: costModelsActions.setCostModelDialog,
  }
)(DistributionCardBase);
