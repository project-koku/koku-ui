import {
  Alert,
  Button,
  FormGroup,
  InputGroup,
  InputGroupText,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import {
  canSubmit,
  CostTypeSelectorBase,
  isRateValid,
} from 'pages/costModels/components/addCostModelRateForm';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';

interface Props extends WrappedComponentProps {
  index: number;
  current: CostModel;
  isProcessing: boolean;
  onClose: () => void;
  onProceed: (
    metric: string,
    measurement: string,
    rate: string,
    costType: string
  ) => void;
  updateError: string;
  metricsHash: MetricHash;
  costTypes: string[];
}

interface State {
  rate: string;
  costType: string;
}

class UpdateRateModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      rate: String(
        this.props.current.rates[this.props.index].tiered_rates[0].value
      ),
      costType: this.props.current.rates[this.props.index].cost_type,
    };
  }
  public render() {
    const {
      updateError,
      current,
      onClose,
      onProceed,
      isProcessing,
      intl,
      index,
      metricsHash,
      costTypes,
    } = this.props;
    const metric = current.rates[index].metric.label_metric;
    const measurement = current.rates[index].metric.label_measurement;
    const originalCostType = current.rates[index].cost_type;
    const originalRate = String(
      this.props.current.rates[this.props.index].tiered_rates[0].value
    );

    return (
      <Modal
        isFooterLeftAligned
        title={intl.formatMessage({ id: 'cost_models_details.edit_rate' })}
        isOpen
        isSmall
        onClose={onClose}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={onClose}
            isDisabled={isProcessing}
          >
            {intl.formatMessage({
              id: 'cost_models_details.add_rate_modal.cancel',
            })}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() =>
              onProceed(
                metric,
                measurement,
                this.state.rate,
                this.state.costType
              )
            }
            isDisabled={
              canSubmit(this.state.rate) ||
              isProcessing ||
              (this.state.costType === originalCostType &&
                this.state.rate === originalRate)
            }
          >
            {intl.formatMessage({
              id: 'cost_models_details.add_rate_modal.save',
            })}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.lg}>
                {intl.formatMessage({
                  id: 'cost_models_details.cost_model.source_type',
                })}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title size={TitleSize.lg}>
                {intl.formatMessage({
                  id: 'cost_models.add_rate_form.metric_select',
                })}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {intl.formatMessage({ id: `cost_models.${metric}` })}
                </Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title size={TitleSize.lg}>
                {intl.formatMessage({
                  id: 'cost_models.add_rate_form.measurement_select',
                })}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {intl.formatMessage(
                    { id: `cost_models.${measurement}` },
                    {
                      units: intl.formatMessage({
                        id: `cost_models.${metricsHash[metric][measurement].label_measurement_unit}`,
                      }),
                    }
                  )}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form>
                <FormGroup
                  label={intl.formatMessage({
                    id: 'cost_models.add_rate_form.rate_input',
                  })}
                  fieldId="rate-input-box"
                  helperTextInvalid={intl.formatMessage({
                    id: 'cost_models.add_rate_form.error_message',
                  })}
                  isValid={isRateValid(this.state.rate)}
                >
                  <InputGroup style={{ width: '350px' }}>
                    <InputGroupText style={{ borderRight: '0' }}>
                      <DollarSignIcon />
                    </InputGroupText>
                    <TextInput
                      style={{ borderLeft: '0' }}
                      type="text"
                      aria-label={intl.formatMessage({
                        id: 'cost_models_wizard.price_list.rate_aria_label',
                      })}
                      id="rate-input-box"
                      value={this.state.rate}
                      onChange={(rate: string) => this.setState({ rate })}
                      isValid={isRateValid(this.state.rate)}
                    />
                  </InputGroup>
                </FormGroup>
                <div style={{ width: '350px' }}>
                  <CostTypeSelectorBase
                    intl={intl}
                    costTypes={costTypes}
                    value={this.state.costType}
                    onChange={value => this.setState({ costType: value })}
                  />
                </div>
              </Form>
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default UpdateRateModelBase;
