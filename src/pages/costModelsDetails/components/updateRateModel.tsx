import {
  Alert,
  Button,
  FormGroup,
  Modal,
  TextInput,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { units } from './priceListTier';

interface Props extends InjectedTranslateProps {
  index: number;
  current: CostModel;
  isProcessing: boolean;
  onClose: () => void;
  onProceed: (metric: string, measurement: string, rate: string) => void;
  updateError: string;
}

interface State {
  rate: string;
}

class UpdateRateModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      rate: String(
        this.props.current.rates[this.props.index].tiered_rates[0].value
      ),
    };
  }
  public render() {
    const {
      updateError,
      current,
      onClose,
      onProceed,
      isProcessing,
      t,
      index,
    } = this.props;
    const metric = current.rates[index].metric.label_metric.toLowerCase();
    const measurement = current.rates[
      index
    ].metric.label_measurement.toLowerCase();

    return (
      <Modal
        title={t('cost_models_details.add_rate_modal.title', {
          name: current.name,
        })}
        isOpen
        isLarge
        onClose={onClose}
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => onProceed(metric, measurement, this.state.rate)}
            isDisabled={
              !Number(this.state.rate) ||
              Number(this.state.rate) <= 0 ||
              isProcessing
            }
          >
            {t('cost_models_details.add_rate_modal.save')}
          </Button>,
          <Button
            key="cancel"
            variant="secondary"
            onClick={onClose}
            isDisabled={isProcessing}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Title size={TitleSize.md}>
            {t('cost_models_details.cost_model.source_type')}
          </Title>
          <Title size={TitleSize.md}>{current.source_type}</Title>
          <Title size={TitleSize.md}>
            {t('cost_models_wizard.price_list.metric_label')}
          </Title>
          <Title size={TitleSize.md}>
            {t(`cost_models_wizard.price_list.${metric}_metric`)}
          </Title>

          <Title size={TitleSize.md}>
            {t('cost_models_wizard.price_list.measurement_label')}
          </Title>
          <Title size={TitleSize.md}>
            {t(`cost_models_wizard.price_list.${measurement}`, {
              units: units(metric),
            })}
          </Title>
          <FormGroup
            label={t('cost_models_wizard.price_list.rate_label')}
            fieldId="rate-input-box"
            helperTextInvalid={t('cost_models_wizard.price_list.rate_error')}
            isValid={Number(this.state.rate) && Number(this.state.rate) > 0}
          >
            <TextInput
              type="text"
              aria-label={t('cost_models_wizard.price_list.rate_aria_label')}
              id="rate-input-box"
              value={this.state.rate}
              onChange={(rate: string) => this.setState({ rate })}
              isValid={Number(this.state.rate) && Number(this.state.rate) > 0}
            />
          </FormGroup>
        </>
      </Modal>
    );
  }
}

export default UpdateRateModelBase;
