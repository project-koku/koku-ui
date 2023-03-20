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
      distribution: this.props.current.distribution,
    };
  }

  private handleDistributionChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ distribution: value });
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
    return (
      <Modal
        title={intl.formatMessage(messages.distributionType)}
        isOpen
        onClose={() => onClose({ name: 'updateDistribution', isOpen: false })}
        variant={ModalVariant.small}
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
                distribution: this.state.distribution,
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
            <TextContent>
              <Text style={styles.cardDescription}>{intl.formatMessage(messages.distributionModelDesc)}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <Form>
              <FormGroup isInline fieldId="cost-distribution" isRequired>
                <Radio
                  isChecked={this.state.distribution === 'cpu'}
                  name="distribution"
                  label={intl.formatMessage(messages.cpuTitle)}
                  aria-label={intl.formatMessage(messages.cpuTitle)}
                  id="cpuDistribution"
                  value="cpu"
                  onChange={this.handleDistributionChange}
                />
                <Radio
                  isChecked={this.state.distribution === 'memory'}
                  name="distribution"
                  label={intl.formatMessage(messages.memoryTitle)}
                  aria-label={intl.formatMessage(messages.memoryTitle)}
                  id="memoryDistribution"
                  value="memory"
                  onChange={this.handleDistributionChange}
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
