import { Checkbox, Content, Form, FormGroup, Radio, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import { useIsGpuToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { styles } from './distribution.styles';

interface DistributionOwnProps {
  distributeGpu?: boolean;
  distributeNetwork: boolean;
  distributePlatformUnallocated: boolean;
  distributeStorage: boolean;
  distributeWorkerUnallocated: boolean;
  distributionType?: string;
  onDistributeNetworkChange: (isChecked: boolean) => void;
  onDistributePlatformUnallocatedChange: (isChecked: boolean) => void;
  onDistributeStorageChange: (isChecked: boolean) => void;
  onDistributeWorkerUnallocatedChange: (isChecked: boolean) => void;
  onDistributeGpuChange: (isChecked: boolean) => void;
  onDistributionTypeChange: (value: string) => void;
}

type DistributionProps = DistributionOwnProps;

const Distribution: React.FC<DistributionProps> = ({
  distributeGpu,
  distributePlatformUnallocated,
  distributeNetwork,
  distributeStorage,
  distributeWorkerUnallocated,
  distributionType,
  onDistributePlatformUnallocatedChange,
  onDistributeWorkerUnallocatedChange,
  onDistributeNetworkChange,
  onDistributeStorageChange,
  onDistributeGpuChange,
  onDistributionTypeChange,
}: DistributionProps) => {
  const intl = useIntl();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl} style={styles.titleWithLearnMore}>
          {intl.formatMessage(messages.costDistribution)}
        </Title>
        <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
          {intl.formatMessage(messages.learnMore)}
        </a>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size={TitleSizes.md}>
          {intl.formatMessage(messages.distributionType)}
        </Title>
        <Content>
          <Content component="p" style={styles.cardDescription}>
            {intl.formatMessage(messages.distributionModelDesc)}
          </Content>
        </Content>
      </StackItem>
      <StackItem>
        <Form>
          <FormGroup isInline fieldId="distribution-type" isRequired>
            <Radio
              isChecked={distributionType === 'cpu'}
              name="distribution-type"
              label={intl.formatMessage(messages.cpuTitle)}
              aria-label={intl.formatMessage(messages.cpuTitle)}
              id="cpu-distribution"
              value="cpu"
              onChange={() => onDistributionTypeChange('cpu')}
            />
            <Radio
              isChecked={distributionType === 'memory'}
              name="distribution-type"
              label={intl.formatMessage(messages.memoryTitle)}
              aria-label={intl.formatMessage(messages.memoryTitle)}
              id="memory-distribution"
              value="memory"
              onChange={() => onDistributionTypeChange('memory')}
            />
          </FormGroup>
        </Form>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3" size={TitleSizes.md}>
          {intl.formatMessage(messages.distributeCostsToProjects)}
        </Title>
      </StackItem>
      <StackItem>
        <Form>
          <FormGroup fieldId="distribute-unallocated-costs" isRequired>
            <Checkbox
              aria-label={intl.formatMessage(messages.distributePlatform)}
              id="distribute-platform"
              isChecked={distributePlatformUnallocated}
              label={intl.formatMessage(messages.distributePlatform)}
              onChange={(_event, checked) => onDistributePlatformUnallocatedChange(checked)}
            />
            <Checkbox
              aria-label={intl.formatMessage(messages.distributeWorker)}
              id="distribute-worker"
              isChecked={distributeWorkerUnallocated}
              label={intl.formatMessage(messages.distributeWorker)}
              onChange={(_event, checked) => onDistributeWorkerUnallocatedChange(checked)}
            />
            <Checkbox
              aria-label={intl.formatMessage(messages.distributeNetwork)}
              id="distribute-network"
              isChecked={distributeNetwork}
              label={intl.formatMessage(messages.distributeNetwork)}
              onChange={(_event, checked) => onDistributeNetworkChange(checked)}
            />
            <Checkbox
              aria-label={intl.formatMessage(messages.distributeStorage)}
              id="distribute-storage"
              isChecked={distributeStorage}
              label={intl.formatMessage(messages.distributeStorage)}
              onChange={(_event, checked) => onDistributeStorageChange(checked)}
            />
            {isGpuToggleEnabled && (
              <Checkbox
                aria-label={intl.formatMessage(messages.distributeGpu)}
                id="distribute-gpu"
                isChecked={distributeGpu}
                label={intl.formatMessage(messages.distributeGpu)}
                onChange={(_event, checked) => onDistributeGpuChange(checked)}
              />
            )}
          </FormGroup>
        </Form>
      </StackItem>
    </Stack>
  );
};

export { Distribution };
