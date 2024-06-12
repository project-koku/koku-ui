import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { FeatureToggleSelectors } from 'store/featureToggle';

import { styles } from './costCalc.styles';

interface UpdateDistributionDialogOwnProps extends WrappedComponentProps {
  current?: CostModel;
}

interface UpdateDistributionDialogStateProps {
  error?: string;
  isLoading?: boolean;
  isOcpCloudNetworkingToggleEnabled?: boolean;
  isOcpProjectStorageToggleEnabled?: boolean;
}

interface UpdateDistributionDialogDispatchProps {
  onClose?: typeof costModelsActions.setCostModelDialog;
  updateCostModel?: typeof costModelsActions.updateCostModel;
}

interface UpdateDistributionDialogState {
  distribution?: string;
  distributeNetwork?: boolean;
  distributePlatformUnallocated?: boolean;
  distributeStorage?: boolean;
  distributeWorkerUnallocated?: boolean;
}

type UpdateDistributionDialogProps = UpdateDistributionDialogOwnProps &
  UpdateDistributionDialogStateProps &
  UpdateDistributionDialogDispatchProps;

class UpdateDistributionDialogBase extends React.Component<
  UpdateDistributionDialogProps,
  UpdateDistributionDialogState
> {
  constructor(props) {
    super(props);
    this.state = {
      distribution: this.props.current.distribution_info.distribution_type,
      distributeNetwork: this.props.current.distribution_info.network_unattributed === true,
      distributePlatformUnallocated: this.props.current.distribution_info.platform_cost === true,
      distributeStorage: this.props.current.distribution_info.storage_unattributed === true,
      distributeWorkerUnallocated: this.props.current.distribution_info.worker_cost === true,
    };
  }

  private handleDistributionChange = event => {
    const { value } = event.currentTarget;
    this.setState({ distribution: value });
  };

  private handleDistributePlatformUnallocatedChange = event => {
    const { value } = event.currentTarget;
    this.setState({ distributePlatformUnallocated: value === 'true' });
  };

  private handleDistributeWorkerUnallocatedChange = event => {
    const { value } = event.currentTarget;
    this.setState({ distributeWorkerUnallocated: value === 'true' });
  };

  private handleDistributeNetworkChange = event => {
    const { value } = event.currentTarget;
    this.setState({ distributeNetwork: value === 'true' });
  };

  private handleDistributeStorageChange = event => {
    const { value } = event.currentTarget;
    this.setState({ distributeStorage: value === 'true' });
  };

  public render() {
    const {
      error,
      current,
      intl,
      isLoading,
      isOcpCloudNetworkingToggleEnabled,
      isOcpProjectStorageToggleEnabled,
      onClose,
      updateCostModel,
    } = this.props;
    return (
      <Modal
        title={intl.formatMessage(messages.costDistribution)}
        description={
          <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.learnMore)}
          </a>
        }
        isOpen
        onClose={() => onClose({ name: 'updateDistribution', isOpen: false })}
        variant={ModalVariant.medium}
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const newState = {
                ...current,
                source_uuids: current.sources.map(provider => provider.uuid),
                // will always be OCP
                source_type: 'OCP',
                distribution_info: {
                  distribution_type: this.state.distribution,
                  network_unattributed: this.state.distributeNetwork,
                  platform_cost: this.state.distributePlatformUnallocated,
                  storage_unattributed: this.state.distributeStorage,
                  worker_cost: this.state.distributeWorkerUnallocated,
                },
              };
              updateCostModel(current.uuid, newState, 'updateDistribution');
            }}
          >
            {intl.formatMessage(messages.save)}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateDistribution', isOpen: false })}
            isDisabled={isLoading}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
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
                  isChecked={this.state.distribution === 'cpu'}
                  name="distribution-type"
                  label={intl.formatMessage(messages.cpuTitle)}
                  aria-label={intl.formatMessage(messages.cpuTitle)}
                  id="cpu-distribution"
                  value="cpu"
                  onChange={this.handleDistributionChange}
                />
                <Radio
                  isChecked={this.state.distribution === 'memory'}
                  name="distribution-type"
                  label={intl.formatMessage(messages.memoryTitle)}
                  aria-label={intl.formatMessage(messages.memoryTitle)}
                  id="memory-distribution"
                  value="memory"
                  onChange={this.handleDistributionChange}
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
                  isChecked={this.state.distributePlatformUnallocated}
                  name="distribute-platform-unallocated"
                  label={intl.formatMessage(messages.distribute)}
                  aria-label={intl.formatMessage(messages.distribute)}
                  id="distribute-platform-true"
                  value="true"
                  onChange={this.handleDistributePlatformUnallocatedChange}
                />
                <Radio
                  isChecked={!this.state.distributePlatformUnallocated}
                  name="distribute-platform-unallocated"
                  label={intl.formatMessage(messages.doNotDistribute)}
                  aria-label={intl.formatMessage(messages.doNotDistribute)}
                  id="distribute-platform-false"
                  value="false"
                  onChange={this.handleDistributePlatformUnallocatedChange}
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
                  isChecked={this.state.distributeWorkerUnallocated}
                  name="distribute-worker-unallocated"
                  label={intl.formatMessage(messages.distribute)}
                  aria-label={intl.formatMessage(messages.distribute)}
                  id="distribute-worker-true"
                  value="true"
                  onChange={this.handleDistributeWorkerUnallocatedChange}
                />
                <Radio
                  isChecked={!this.state.distributeWorkerUnallocated}
                  name="distribute-worker-unallocated"
                  label={intl.formatMessage(messages.doNotDistribute)}
                  aria-label={intl.formatMessage(messages.doNotDistribute)}
                  id="distribute-worker-false"
                  value="false"
                  onChange={this.handleDistributeWorkerUnallocatedChange}
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
                      isChecked={this.state.distributeNetwork}
                      name="distribute-network"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distribute-network-true"
                      value="true"
                      onChange={this.handleDistributeNetworkChange}
                    />
                    <Radio
                      isChecked={!this.state.distributeNetwork}
                      name="distribute-network"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distribute-network-false"
                      value="false"
                      onChange={this.handleDistributeNetworkChange}
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
                      isChecked={this.state.distributeStorage}
                      name="distribute-storage"
                      label={intl.formatMessage(messages.distribute)}
                      aria-label={intl.formatMessage(messages.distribute)}
                      id="distribute-storage-true"
                      value="true"
                      onChange={this.handleDistributeStorageChange}
                    />
                    <Radio
                      isChecked={!this.state.distributeStorage}
                      name="distribute-storage"
                      label={intl.formatMessage(messages.doNotDistribute)}
                      aria-label={intl.formatMessage(messages.doNotDistribute)}
                      id="distribute-storage-false"
                      value="false"
                      onChange={this.handleDistributeStorageChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
            </>
          )}
        </Stack>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<UpdateDistributionDialogOwnProps, UpdateDistributionDialogStateProps>(
  state => {
    return {
      isLoading: costModelsSelectors.updateProcessing(state),
      isOcpCloudNetworkingToggleEnabled: FeatureToggleSelectors.selectIsOcpCloudNetworkingToggleEnabled(state),
      isOcpProjectStorageToggleEnabled: FeatureToggleSelectors.selectIsOcpProjectStorageToggleEnabled(state),
      error: costModelsSelectors.updateError(state),
    };
  }
);

const mapDispatchToProps: UpdateDistributionDialogDispatchProps = {
  onClose: costModelsActions.setCostModelDialog,
  updateCostModel: costModelsActions.updateCostModel,
};

const UpdateDistributionDialog = injectIntl(connect(mapStateToProps, mapDispatchToProps)(UpdateDistributionDialogBase));

export default UpdateDistributionDialog;
