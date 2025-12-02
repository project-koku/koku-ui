import type { CostModel } from '@koku-ui/api/costModels';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { currencyOptions } from '../../../components/currency';
import { Selector } from '../components/inputs/selector';
import { styles } from '../costModelWizard/wizard.styles';

interface UpdateCostModelOwnProps extends WrappedComponentProps {
  // TBD...
}

interface UpdateCostModelStateProps {
  costModel?: CostModel[];
  updateError?: string;
  isProcessing?: boolean;
}

interface UpdateCostModelDispatchProps {
  onProceed?: () => void;
  setDialogOpen?: typeof costModelsActions.setCostModelDialog;
  updateCostModel?: typeof costModelsActions.updateCostModel;
}

interface UpdateCostModelState {
  name?: string;
  currency?: string;
  description?: string;
}

type UpdateCostModelProps = UpdateCostModelOwnProps & UpdateCostModelStateProps & UpdateCostModelDispatchProps;

class UpdateCostModelBase extends React.Component<UpdateCostModelProps, UpdateCostModelState> {
  constructor(props) {
    super(props);
    const current = this.props.costModel[0];
    this.state = {
      name: current.name,
      currency: current.currency,
      description: current.description,
    };
  }
  public render() {
    const { costModel, intl, isProcessing, setDialogOpen, updateCostModel, updateError } = this.props;
    const current = costModel[0];
    const getValueLabel = (valStr: string, options) => {
      const val = options.find(o => o.value === valStr);
      return !val ? valStr : intl.formatMessage(val.label, { units: val.value });
    };
    // Workaround for https://issues.redhat.com/browse/COST-4355
    const updateRatesCurrency = rates => {
      if (!rates) {
        return rates;
      }
      const result = cloneDeep(rates);
      result.map(val => {
        if (val.tiered_rates) {
          for (const rate of val.tiered_rates) {
            rate.unit = this.state.currency;
            rate.usage.unit = this.state.currency;
          }
        }
        if (val.tag_rates) {
          for (const rate of val.tag_rates.tag_values) {
            rate.unit = this.state.currency;
          }
        }
      });
      return result;
    };
    return (
      <Modal
        isOpen
        onClose={() => setDialogOpen({ name: 'updateCostModel', isOpen: false })}
        variant={ModalVariant.small}
      >
        <ModalHeader title={intl.formatMessage(messages.editCostModel)} />
        <ModalBody>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Form>
            <FormGroup label={intl.formatMessage(messages.names, { count: 1 })} isRequired fieldId="name">
              <TextInput
                isRequired
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={(_evt, value) => this.setState({ name: value })}
              />
            </FormGroup>
            <FormGroup label={intl.formatMessage(messages.description)} fieldId="description">
              <TextArea
                type="text"
                id="description"
                name="description"
                value={this.state.description}
                onChange={(_evt, value) => this.setState({ description: value })}
              />
            </FormGroup>
            <FormGroup fieldId="currency">
              <Selector
                label={messages.currency}
                direction="up"
                appendMenuTo="inline"
                maxMenuHeight={styles.selector.maxHeight as string}
                toggleAriaLabel={intl.formatMessage(messages.costModelsWizardCurrencyToggleLabel)}
                value={getValueLabel(this.state.currency, currencyOptions)}
                onSelect={(_evt, value) => this.setState({ currency: value })}
                id="currency-units-selector"
                options={currencyOptions.map(o => {
                  return {
                    label: intl.formatMessage(o.label, { units: o.value }),
                    value: o.value,
                  };
                })}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
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
                  currency: this.state.currency,
                  description: this.state.description,
                  source_type: current.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
                  rates: updateRatesCurrency(previous.rates),
                } as any,
                'updateCostModel'
              );
            }}
            isDisabled={
              isProcessing ||
              (this.state.name === current.name &&
                this.state.currency === current.currency &&
                this.state.description === current.description)
            }
          >
            {intl.formatMessage(messages.save)}
          </Button>
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => setDialogOpen({ name: 'updateCostModel', isOpen: false })}
            isDisabled={isProcessing}
          >
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<UpdateCostModelOwnProps, UpdateCostModelStateProps>(state => {
  return {
    costModel: costModelsSelectors.costModels(state),
    isProcessing: costModelsSelectors.updateProcessing(state),
    updateError: costModelsSelectors.updateError(state),
  };
});

const mapDispatchToProps: UpdateCostModelDispatchProps = {
  setDialogOpen: costModelsActions.setCostModelDialog,
  updateCostModel: costModelsActions.updateCostModel,
};

const UpdateCostModel = injectIntl(connect(mapStateToProps, mapDispatchToProps)(UpdateCostModelBase));

export default UpdateCostModel;
