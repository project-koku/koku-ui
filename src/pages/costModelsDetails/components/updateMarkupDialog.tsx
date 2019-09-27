import {
  Alert,
  Button,
  FormGroup,
  Modal,
  TextInput,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface Props extends InjectedTranslateProps {
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  current: CostModel;
}

interface State {
  markup: string;
}

class UpdateMarkupModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      markup: String(this.props.current.markup.value),
    };
  }
  public render() {
    const {
      error,
      current,
      onClose,
      updateCostModel,
      isLoading,
      t,
    } = this.props;
    return (
      <Modal
        title={t('cost_models_details.edit_markup', {
          cost_model: current.name,
        })}
        isOpen
        isLarge
        onClose={() => onClose({ name: 'updateMarkup', isOpen: false })}
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const newState = {
                ...current,
                provider_uuids: current.providers.map(
                  provider => provider.uuid
                ),
                source_type:
                  current.source_type === 'OpenShift Container Platform'
                    ? 'OCP'
                    : 'AWS',
                markup: {
                  value: this.state.markup,
                  unit: 'percent',
                },
              };
              updateCostModel(current.uuid, newState, 'updateMarkup');
            }}
            isDisabled={isLoading}
          >
            {t('cost_models_details.add_rate_modal.save')}
          </Button>,
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
        ]}
      >
        <>
          {error && <Alert variant="danger" title={`${error}`} />}
          <FormGroup
            label={t('cost_models_wizard.markup.markup_label')}
            fieldId="markup-input-box"
            helperTextInvalid={t('cost_models_wizard.markup.markup_error')}
            isValid={!isNaN(Number(this.state.markup))}
          >
            <TextInput
              type="text"
              aria-label={t('cost_models_wizard.markup.markup_label')}
              id="markup-input-box"
              value={this.state.markup}
              onChange={(markup: string) => this.setState({ markup })}
              isValid={!isNaN(Number(this.state.markup))}
            />
          </FormGroup>
        </>
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => {
    return {
      isLoading: costModelsSelectors.updateProcessing(state),
      error: costModelsSelectors.updateError(state),
      current: costModelsSelectors.selected(state),
    };
  }),
  {
    onClose: costModelsActions.setCostModelDialog,
    updateCostModel: costModelsActions.updateCostModel,
  }
)(translate()(UpdateMarkupModelBase));
