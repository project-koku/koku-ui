import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface Props extends InjectedTranslateProps {
  costModel: CostModel[];
  isProcessing: boolean;
  onProceed?: () => void;
  updateError: string;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
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
    const {
      updateCostModel,
      updateError,
      costModel,
      isProcessing,
      setDialogOpen,
      t,
    } = this.props;
    const current = costModel[0];
    return (
      <Modal
        title={t('cost_models_details.edit_cost_model', {
          cost_model: current.name,
        })}
        isOpen
        onClose={() =>
          setDialogOpen({ name: 'updateCostModel', isOpen: false })
        }
        variant={ModalVariant.small}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={() =>
              setDialogOpen({ name: 'updateCostModel', isOpen: false })
            }
            isDisabled={isProcessing}
          >
            {t('dialog.cancel')}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const {
                uuid,
                sources,
                created_timestamp,
                updated_timestamp,
                ...previous
              } = current;
              updateCostModel(
                uuid,
                {
                  ...previous,
                  source_uuids: sources.map(provider => provider.uuid),
                  name: this.state.name,
                  description: this.state.description,
                  source_type:
                    current.source_type === 'OpenShift Container Platform'
                      ? 'OCP'
                      : 'AWS',
                },
                'updateCostModel'
              );
            }}
            isDisabled={
              isProcessing ||
              (this.state.name === current.name &&
                this.state.description === current.description)
            }
          >
            {t('cost_models_details.save_button')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Form>
            <FormGroup
              label={t('cost_models_wizard.general_info.name_label')}
              isRequired
              fieldId="name"
            >
              <TextInput
                isRequired
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={value => this.setState({ name: value })}
              />
            </FormGroup>
            <FormGroup
              label={t('cost_models_wizard.general_info.description_label')}
              fieldId="description"
            >
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

const UpdateCostModelModal = connect(
  createMapStateToProps(state => ({
    costModel: costModelsSelectors.costModels(state),
    isProcessing: costModelsSelectors.updateProcessing(state),
    updateError: costModelsSelectors.updateError(state),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    updateCostModel: costModelsActions.updateCostModel,
  }
)(translate()(UpdateCostModelBase));

export default UpdateCostModelModal;
