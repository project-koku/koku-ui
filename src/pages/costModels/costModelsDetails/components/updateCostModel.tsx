import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
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
  current: CostModel;
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
    this.state = {
      name: this.props.current.name,
      description: this.props.current.description,
    };
  }
  public render() {
    const {
      updateCostModel,
      updateError,
      current,
      isProcessing,
      setDialogOpen,
      t,
    } = this.props;
    return (
      <Modal
        isFooterLeftAligned
        title={t('cost_models_details.edit_cost_model', {
          cost_model: current.name,
        })}
        isOpen
        isSmall
        onClose={() =>
          setDialogOpen({ name: 'updateCostModel', isOpen: false })
        }
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
                providers,
                created_timestamp,
                updated_timestamp,
                ...previous
              } = current;
              updateCostModel(
                uuid,
                {
                  ...previous,
                  provider_uuids: providers.map(provider => provider.uuid),
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
              (this.state.name === this.props.current.name &&
                this.state.description === this.props.current.description)
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

export default connect(
  createMapStateToProps(state => ({
    isProcessing: costModelsSelectors.updateProcessing(state),
    updateError: costModelsSelectors.updateError(state),
    current: costModelsSelectors.selected(state),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    updateCostModel: costModelsActions.updateCostModel,
  }
)(translate()(UpdateCostModelBase));
