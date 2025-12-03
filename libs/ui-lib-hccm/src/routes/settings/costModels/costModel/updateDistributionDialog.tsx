import type { CostModel } from '@koku-ui/api/costModels';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Button,
  Checkbox,
  Content,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { styles } from './costCalc.styles';

interface UpdateDistributionDialogOwnProps extends WrappedComponentProps {
  current?: CostModel;
}

interface UpdateDistributionDialogStateProps {
  error?: string;
  isLoading?: boolean;
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

  private handleDistributePlatformUnallocatedChange = (event, isChecked) => {
    this.setState({ distributePlatformUnallocated: isChecked });
  };

  private handleDistributeWorkerUnallocatedChange = (event, isChecked) => {
    this.setState({ distributeWorkerUnallocated: isChecked });
  };

  private handleDistributeNetworkChange = (event, isChecked) => {
    this.setState({ distributeNetwork: isChecked });
  };

  private handleDistributeStorageChange = (event, isChecked) => {
    this.setState({ distributeStorage: isChecked });
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
    return (
      <Modal
        isOpen
        onClose={() => onClose({ name: 'updateDistribution', isOpen: false })}
        variant={ModalVariant.medium}
      >
        <ModalHeader
          description={
            <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          }
          title={intl.formatMessage(messages.costDistribution)}
        />
        <ModalBody>
          <Stack hasGutter>
            <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
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
                {intl.formatMessage(messages.distributeCostsToProjects)}
              </Title>
            </StackItem>
            <StackItem isFilled>
              <Form>
                <FormGroup fieldId="distribute-unallocated-costs" isRequired>
                  <Checkbox
                    aria-label={intl.formatMessage(messages.distributePlatform)}
                    id="distribute-platform"
                    isChecked={this.state.distributePlatformUnallocated}
                    label={intl.formatMessage(messages.distributePlatform)}
                    onChange={this.handleDistributePlatformUnallocatedChange}
                  />
                  <Checkbox
                    aria-label={intl.formatMessage(messages.distributeWorker)}
                    id="distribute-worker"
                    isChecked={this.state.distributeWorkerUnallocated}
                    label={intl.formatMessage(messages.distributeWorker)}
                    onChange={this.handleDistributeWorkerUnallocatedChange}
                  />
                  <Checkbox
                    aria-label={intl.formatMessage(messages.distributeNetwork)}
                    id="distribute-network"
                    isChecked={this.state.distributeNetwork}
                    label={intl.formatMessage(messages.distributeNetwork)}
                    onChange={this.handleDistributeNetworkChange}
                  />
                  <Checkbox
                    aria-label={intl.formatMessage(messages.distributeStorage)}
                    id="distribute-storage"
                    isChecked={this.state.distributeStorage}
                    label={intl.formatMessage(messages.distributeStorage)}
                    onChange={this.handleDistributeStorageChange}
                  />
                </FormGroup>
              </Form>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter>
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
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateDistribution', isOpen: false })}
            isDisabled={isLoading}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<UpdateDistributionDialogOwnProps, UpdateDistributionDialogStateProps>(
  state => {
    return {
      isLoading: costModelsSelectors.updateProcessing(state),
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
