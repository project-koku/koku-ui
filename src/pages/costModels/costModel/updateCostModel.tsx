import { Alert, Button, Form, FormGroup, Modal, TextArea, TextInput } from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface Props extends WrappedComponentProps {
  costModel?: CostModel[];
  isProcessing?: boolean;
  onProceed?: () => void;
  updateError?: string;
  setDialogOpen?: typeof costModelsActions.setCostModelDialog;
  updateCostModel?: typeof costModelsActions.updateCostModel;
}

interface State {
  name: string;
  description: string;
}

class UpdateCostModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const current = this.props.costModel[0];
    this.state = {
      name: current.name,
      description: current.description,
    };
  }
  public render() {
    const { costModel, intl, isProcessing, setDialogOpen, updateCostModel, updateError } = this.props;
    const current = costModel[0];
    return (
      <Modal
        title={intl.formatMessage(messages.editCostModel)}
        isOpen
        onClose={() => setDialogOpen({ name: 'updateCostModel', isOpen: false })}
        variant="small"
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const { uuid, sources, ...previous } = current;
              updateCostModel(
                uuid,
                {
                  ...previous,
                  source_uuids: sources.map(provider => provider.uuid),
                  name: this.state.name,
                  description: this.state.description,
                  source_type: current.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
                },
                'updateCostModel'
              );
            }}
            isDisabled={
              isProcessing || (this.state.name === current.name && this.state.description === current.description)
            }
          >
            {intl.formatMessage(messages.save)}
          </Button>,
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => setDialogOpen({ name: 'updateCostModel', isOpen: false })}
            isDisabled={isProcessing}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Form>
            <FormGroup label={intl.formatMessage(messages.names, { count: 1 })} isRequired fieldId="name">
              <TextInput
                isRequired
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={value => this.setState({ name: value })}
              />
            </FormGroup>
            <FormGroup label={intl.formatMessage(messages.description)} fieldId="description">
              <TextArea
                type="text"
                id="description"
                name="description"
                value={this.state.description}
                onChange={value => this.setState({ description: value })}
              />
            </FormGroup>
          </Form>
        </>
      </Modal>
    );
  }
}

const UpdateCostModelModal = injectIntl(
  connect(
    createMapStateToProps(state => ({
      costModel: costModelsSelectors.costModels(state),
      isProcessing: costModelsSelectors.updateProcessing(state),
      updateError: costModelsSelectors.updateError(state),
    })),
    {
      setDialogOpen: costModelsActions.setCostModelDialog,
      updateCostModel: costModelsActions.updateCostModel,
    }
  )(UpdateCostModelBase)
);

export default UpdateCostModelModal;
