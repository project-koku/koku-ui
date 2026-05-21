import { Button, ButtonVariant, Card, CardBody, CardHeader, Title, TitleSizes } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import { useIsGpuToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ReadOnlyTooltip } from 'routes/settings/costModelsDeprecated/components/readOnlyTooltip';

import { styles } from './distribution.styles';
import { DistributionModal } from './distributionModal';

interface DistributionOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onSave?: (costModel: CostModel) => void;
}

type DistributionProps = DistributionOwnProps;

const Distribution: React.FC<DistributionProps> = ({ canWrite, costModel, onSave }) => {
  const intl = useIntl();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers

  const handleOnSave = (item: CostModel) => {
    setIsModalOpen(false);
    onSave?.(item);
  };

  const handleOnModalClick = () => {
    setIsModalOpen(true);
  };

  const handleOnModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card style={styles.card}>
        <CardHeader
          actions={{
            actions: (
              <ReadOnlyTooltip key="edit" isDisabled={!canWrite}>
                <Button
                  aria-label={intl.formatMessage(messages.costModelsDistributionEdit)}
                  isAriaDisabled={!canWrite}
                  onClick={handleOnModalClick}
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
              type: costModel?.distribution_info?.distribution_type ?? '',
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributePlatformCosts, {
              value: costModel?.distribution_info?.platform_cost ?? 0,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeUnallocatedCapacity, {
              value: costModel?.distribution_info?.worker_cost ?? 0,
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: costModel?.distribution_info?.network_unattributed || false,
              type: 'network',
            })}
          </div>
          <div>
            {intl.formatMessage(messages.distributeCosts, {
              value: costModel?.distribution_info?.storage_unattributed || false,
              type: 'storage',
            })}
          </div>
          {isGpuToggleEnabled && (
            <div>
              {intl.formatMessage(messages.distributeGpuCosts, {
                value: costModel?.distribution_info?.gpu_unallocated || false,
              })}
            </div>
          )}
        </CardBody>
      </Card>
      <DistributionModal
        canWrite={canWrite}
        costModel={costModel}
        isOpen={isModalOpen}
        onSave={handleOnSave}
        onClose={handleOnModalClose}
      />
    </>
  );
};

export { Distribution };
