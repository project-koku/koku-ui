import { FormGroup, Radio, Stack, StackItem, Text, TextContent, Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Form } from 'routes/settings/costModels/components/forms/form';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';

import { CostModelContext } from './context';
import { styles } from './wizard.styles';

interface DistributionOwnProps extends WrappedComponentProps {
  // TBD...
}

interface DistributionStateProps {
  isOcpCloudNetworkingToggleEnabled?: boolean;
  isOcpProjectStorageToggleEnabled?: boolean;
}

type DistributionProps = DistributionOwnProps & DistributionStateProps;

class DistributionBase extends React.Component<DistributionProps, DistributionStateProps> {
  public render() {
    const { isOcpCloudNetworkingToggleEnabled, isOcpProjectStorageToggleEnabled, intl } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          handleDistributionChange,
          handleDistributeNetworkChange,
          handleDistributePlatformUnallocatedChange,
          handleDistributeStorageChange,
          handleDistributeWorkerUnallocatedChange,
          distribution,
          distributeNetwork,
          distributePlatformUnallocated,
          distributeStorage,
          distributeWorkerUnallocated,
        }) => {
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
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.distributionModelDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-type" isRequired>
                    <Radio
                      isChecked={distribution === 'cpu'}
                      name="distribution-type"
                      label={intl.formatMessage(messages.cpuTitle)}
                      aria-label={intl.formatMessage(messages.cpuTitle)}
                      id="cpu-distribution"
                      value="cpu"
                      onChange={handleDistributionChange}
                    />
                    <Radio
                      isChecked={distribution === 'memory'}
                      name="distribution-type"
                      label={intl.formatMessage(messages.memoryTitle)}
                      aria-label={intl.formatMessage(messages.memoryTitle)}
                      id="memory-distribution"
                      value="memory"
                      onChange={handleDistributionChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size={TitleSizes.md}>
                  {intl.formatMessage(messages.platform)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.platformDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-platform-unallocated" isRequired>
                    <Radio
                      isChecked={distributePlatformUnallocated}
                      name="distribute-platformUnallocated"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distribute-platformTrue"
                      value="true"
                      onChange={handleDistributePlatformUnallocatedChange}
                    />
                    <Radio
                      isChecked={!distributePlatformUnallocated}
                      name="distribute-platformUnallocated"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distributePlatformFalse"
                      value="false"
                      onChange={handleDistributePlatformUnallocatedChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size={TitleSizes.md}>
                  {intl.formatMessage(messages.workerUnallocated)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.workerUnallocatedDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-worker-unallocated" isRequired>
                    <Radio
                      isChecked={distributeWorkerUnallocated}
                      name="distribute-worker-unallocated"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distribute-worker-true"
                      value="true"
                      onChange={handleDistributeWorkerUnallocatedChange}
                    />
                    <Radio
                      isChecked={!distributeWorkerUnallocated}
                      name="distribute-worker-unallocated"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distribute-worker-false"
                      value="false"
                      onChange={handleDistributeWorkerUnallocatedChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              {isOcpCloudNetworkingToggleEnabled && (
                <>
                  <StackItem>
                    <Title headingLevel="h3" size={TitleSizes.md}>
                      {intl.formatMessage(messages.network)}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>{intl.formatMessage(messages.networkDesc)}</Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution-network" isRequired>
                        <Radio
                          isChecked={distributeNetwork}
                          name="distribute-network"
                          label={intl.formatMessage(messages.distribute)}
                          aria-label={intl.formatMessage(messages.distribute)}
                          id="distribute-network-true"
                          value="true"
                          onChange={handleDistributeNetworkChange}
                        />
                        <Radio
                          isChecked={!distributeNetwork}
                          name="distribute-network"
                          label={intl.formatMessage(messages.doNotDistribute)}
                          aria-label={intl.formatMessage(messages.doNotDistribute)}
                          id="distribute-network-false"
                          value="false"
                          onChange={handleDistributeNetworkChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </>
              )}
              {isOcpProjectStorageToggleEnabled && (
                <>
                  <StackItem>
                    <Title headingLevel="h3" size={TitleSizes.md}>
                      {intl.formatMessage(messages.storage)}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>{intl.formatMessage(messages.storageDesc)}</Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution-storage" isRequired>
                        <Radio
                          isChecked={distributeStorage}
                          name="distribute-storage"
                          label={intl.formatMessage(messages.distribute)}
                          aria-label={intl.formatMessage(messages.distribute)}
                          id="distribute-storage-true"
                          value="true"
                          onChange={handleDistributeStorageChange}
                        />
                        <Radio
                          isChecked={!distributeStorage}
                          name="distribute-storage"
                          label={intl.formatMessage(messages.doNotDistribute)}
                          aria-label={intl.formatMessage(messages.doNotDistribute)}
                          id="distribute-storage-false"
                          value="false"
                          onChange={handleDistributeStorageChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </>
              )}
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

const mapStateToProps = createMapStateToProps<undefined, DistributionStateProps>(state => {
  return {
    isOcpCloudNetworkingToggleEnabled: FeatureToggleSelectors.selectIsOcpCloudNetworkingToggleEnabled(state),
    isOcpProjectStorageToggleEnabled: FeatureToggleSelectors.selectIsOcpProjectStorageToggleEnabled(state),
  };
});

const Distribution = injectIntl(connect(mapStateToProps, {})(DistributionBase));

export default Distribution;
