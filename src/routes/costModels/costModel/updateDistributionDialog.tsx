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
  distributePlatformUnallocated?: boolean;
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
      distributePlatformUnallocated: this.props.current.distribution_info.platform_cost === true,
      distributeWorkerUnallocated: this.props.current.distribution_info.worker_cost === true,
    };
  }

  private handleDistributionChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ distribution: value });
  };

  private handleDistributePlatformUnallocatedChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ distributePlatformUnallocated: value === 'true' });
  };

  private handleDistributeWorkerUnallocatedChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ distributeWorkerUnallocated: value === 'true' });
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
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
                  platform_cost: this.state.distributePlatformUnallocated,
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
                  name="distributionType"
                  label={intl.formatMessage(messages.cpuTitle)}
                  aria-label={intl.formatMessage(messages.cpuTitle)}
                  id="cpuDistribution"
                  value="cpu"
                  onChange={this.handleDistributionChange}
                />
                <Radio
                  isChecked={this.state.distribution === 'memory'}
                  name="distributionType"
                  label={intl.formatMessage(messages.memoryTitle)}
                  aria-label={intl.formatMessage(messages.memoryTitle)}
                  id="memoryDistribution"
                  value="memory"
                  onChange={this.handleDistributionChange}
                />
              </FormGroup>
            </Form>
          </StackItem>
          <StackItem>
            <Title headingLevel="h3" size="md">
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
                  name="distributePlatformUnallocated"
                  label={intl.formatMessage(messages.distribute)}
                  aria-label={intl.formatMessage(messages.distribute)}
                  id="distributePlatformTrue"
                  value="true"
                  onChange={this.handleDistributePlatformUnallocatedChange}
                />
                <Radio
                  isChecked={!this.state.distributePlatformUnallocated}
                  name="distributePlatformUnallocated"
                  label={intl.formatMessage(messages.doNotDistribute)}
                  aria-label={intl.formatMessage(messages.doNotDistribute)}
                  id="distributePlatformFalse"
                  value="false"
                  onChange={this.handleDistributePlatformUnallocatedChange}
                />
              </FormGroup>
            </Form>
          </StackItem>
          <StackItem>
            <Title headingLevel="h3" size="md">
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
                  name="distributeWorkerUnallocated"
                  label={intl.formatMessage(messages.distribute)}
                  aria-label={intl.formatMessage(messages.distribute)}
                  id="distributeWorkerTrue"
                  value="true"
                  onChange={this.handleDistributeWorkerUnallocatedChange}
                />
                <Radio
                  isChecked={!this.state.distributeWorkerUnallocated}
                  name="distributeWorkerUnallocated"
                  label={intl.formatMessage(messages.doNotDistribute)}
                  aria-label={intl.formatMessage(messages.doNotDistribute)}
                  id="distributeWorkerFalse"
                  value="false"
                  onChange={this.handleDistributeWorkerUnallocatedChange}
                />
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
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
