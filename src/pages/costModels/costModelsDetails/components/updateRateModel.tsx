import {
  Alert,
  Button,
  FormGroup,
  InputGroup,
  InputGroupText,
  Modal,
  ModalVariant,
  Stack,
  StackItem,
  Switch,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSizes,
  ValidatedOptions,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import {
  canSubmit,
  isRateValid,
} from 'pages/costModels/components/addCostModelRateForm';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  index: number;
  current: CostModel;
  isProcessing: boolean;
  onClose: () => void;
  onProceed: (
    metric: string,
    measurement: string,
    rate: string,
    isInfra: boolean
  ) => void;
  updateError: string;
  metricsHash: MetricHash;
}

interface State {
  rate: string;
  isInfra: boolean;
}

class UpdateRateModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      rate: String(
        this.props.current.rates[this.props.index].tiered_rates[0].value
      ),
      isInfra:
        this.props.current.rates[this.props.index].cost_type ===
        'Infrastructure',
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
      metricsHash,
    } = this.props;
    const metric = current.rates[index].metric.label_metric;
    const measurement = current.rates[index].metric.label_measurement;
    const originalIsInfra = current.rates[index].cost_type === 'Infrastructure';
    const originalRate = String(
      this.props.current.rates[this.props.index].tiered_rates[0].value
    );

    const validated =
      this.state.rate === ''
        ? ValidatedOptions.default
        : isRateValid(this.state.rate)
        ? ValidatedOptions.success
        : ValidatedOptions.error;

    return (
      <Modal
        title={t('cost_models_details.edit_rate')}
        isOpen
        onClose={onClose}
        variant={ModalVariant.small}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={onClose}
            isDisabled={isProcessing}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() =>
              onProceed(
                metric,
                measurement,
                this.state.rate,
                this.state.isInfra
              )
            }
            isDisabled={
              canSubmit(this.state.rate) ||
              isProcessing ||
              (this.state.isInfra === originalIsInfra &&
                this.state.rate === originalRate)
            }
          >
            {t('cost_models_details.add_rate_modal.save')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h1" size={TitleSizes.lg}>
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title headingLevel="h1" size={TitleSizes.lg}>
                {t('cost_models.add_rate_form.metric_select')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t(`cost_models.${metric}`)}
                </Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title headingLevel="h1" size={TitleSizes.lg}>
                {t('cost_models.add_rate_form.measurement_select')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t(`cost_models.${measurement}`, {
                    units: t(
                      `cost_models.${metricsHash[metric][measurement].label_measurement_unit}`
                    ),
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form>
                <FormGroup
                  label={t('cost_models.add_rate_form.rate_input')}
                  fieldId="rate-input-box"
                  helperTextInvalid={t(
                    'cost_models.add_rate_form.error_message'
                  )}
                  validated={validated}
                >
                  <InputGroup style={{ width: '150px' }}>
                    <InputGroupText style={{ borderRight: '0' }}>
                      <DollarSignIcon />
                    </InputGroupText>
                    <TextInput
                      style={{ borderLeft: '0' }}
                      type="text"
                      aria-label={t(
                        'cost_models_wizard.price_list.rate_aria_label'
                      )}
                      id="rate-input-box"
                      value={this.state.rate}
                      onChange={(rate: string) => this.setState({ rate })}
                      validated={validated}
                    />
                  </InputGroup>
                </FormGroup>
                <Switch
                  id="infrastructure-cost"
                  label={t('cost_models.infra_cost_switch')}
                  isChecked={this.state.isInfra}
                  onChange={(checked: boolean) =>
                    this.setState({ isInfra: checked })
                  }
                />
              </Form>
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default UpdateRateModelBase;
