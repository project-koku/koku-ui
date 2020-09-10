import {
  Alert,
  Button,
  ButtonVariant,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import {
  SetMeasurement,
  SetMetric,
  SetRate,
  unusedRates,
} from 'pages/costModels/components/addCostModelRateForm';
import {
  addRateMachine,
  CurrentStateMachine,
} from 'pages/costModels/components/addPriceList';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { interpret } from 'xstate';

import { styles } from './addRateModal.styles';

interface Props extends InjectedTranslateProps {
  current: CostModel;
  isProcessing?: boolean;
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
  current: CurrentStateMachine;
}

export class AddRateModelBase extends React.Component<Props, State> {
  public service = interpret(addRateMachine).onTransition(current =>
    this.setState({ current })
  );
  public state = { current: addRateMachine.initialState };

  public componentDidMount() {
    this.service.start();
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public renderActionButtons() {
    const { t, onClose, isProcessing, onProceed } = this.props;
    const {
      current,
      current: {
        context: { metric, measurement, rate, costType },
      },
    } = this.state;

    if (current.matches('setRate.valid')) {
      const ValidCancelButton = (
        <Button
          key="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
          isDisabled={isProcessing}
        >
          {t('cost_models_details.add_rate_modal.cancel')}
        </Button>
      );
      const ValidOkButton = (
        <Button
          key="proceed"
          variant={ButtonVariant.primary}
          onClick={() => onProceed(metric, measurement, rate, costType)}
          isDisabled={isProcessing}
        >
          {t('cost_models_details.add_rate')}
        </Button>
      );
      return [ValidOkButton, ValidCancelButton];
    }
    const CancelButton = (
      <Button key="cancel" variant={ButtonVariant.link} onClick={onClose}>
        {t('cost_models_details.add_rate_modal.cancel')}
      </Button>
    );
    const OkButton = (
      <Button key="proceed" variant={ButtonVariant.primary} isDisabled>
        {t('cost_models_details.add_rate')}
      </Button>
    );
    return [OkButton, CancelButton];
  }

  public renderForm() {
    const {
      current: {
        context: { metric, measurement, rate, costType },
      },
    } = this.state;
    const { metricsHash, costTypes, current, t } = this.props;
    const { send } = this.service;
    const stateNames = this.state.current.toStrings();
    const mainState = stateNames.length > 1 ? stateNames[1] : stateNames[0];

    const availableRates = unusedRates(
      metricsHash,
      current.rates.map(r => ({
        metric: r.metric.label_metric,
        measurement: r.metric.label_measurement,
      }))
    );

    switch (mainState) {
      case 'setMetric':
        return (
          <SetMetric
            t={t}
            options={Object.keys(availableRates).map(r => ({
              label: t(`cost_models.${r}`),
              value: r,
            }))}
            onChange={(value: string) =>
              send({ type: 'CHANGE_METRIC', payload: { metric: value } })
            }
            value={metric}
          />
        );
      case 'setMeasurement':
        return (
          <SetMeasurement
            t={t}
            metricOptions={Object.keys(availableRates).map(r => ({
              label: t(`cost_models.${r}`),
              value: r,
            }))}
            metricChange={(value: string) =>
              send({ type: 'CHANGE_METRIC', payload: { metric: value } })
            }
            metric={metric}
            measurementOptions={Object.keys(availableRates[metric]).map(m => ({
              label: t(`cost_models.${m}`, {
                units: metricsHash[metric][m].label_measurement_unit,
              }),
              value: m,
            }))}
            measurement={measurement}
            measurementChange={(value: string) =>
              send({
                type: 'CHANGE_MEASUREMENT',
                payload: {
                  measurement: value,
                  costType: metricsHash[metric][value].default_cost_type,
                },
              })
            }
          />
        );
      case 'setRate.init':
      case 'setRate.valid':
        return (
          <>
            <SetRate
              t={t}
              metricOptions={Object.keys(availableRates).map(r => ({
                label: t(`cost_models.${r}`),
                value: r,
              }))}
              metricChange={(value: string) =>
                send({ type: 'CHANGE_METRIC', payload: { metric: value } })
              }
              metric={metric}
              measurementOptions={Object.keys(availableRates[metric] || {}).map(
                m => ({
                  label: t(`cost_models.${m}`, {
                    units: metricsHash[metric][m].label_measurement_unit,
                  }),
                  value: m,
                })
              )}
              measurement={measurement}
              measurementChange={(value: string) =>
                send({
                  type: 'CHANGE_MEASUREMENT',
                  payload: {
                    measurement: value,
                    costType: metricsHash[metric][value].default_cost_type,
                  },
                })
              }
              rate={rate}
              rateChange={(value: string) =>
                send({ type: 'CHANGE_RATE', payload: { rate: value } })
              }
              isRateInvalid={false}
              isMeasurementInvalid={false}
              costTypes={costTypes}
              costType={costType}
              costTypeChange={value =>
                send({
                  type: 'CHANGE_INFRA_COST',
                  payload: { costType: value },
                })
              }
            />
          </>
        );
      case 'setRate.invalid':
        return (
          <>
            <SetRate
              t={t}
              metricOptions={Object.keys(availableRates).map(r => ({
                label: t(`cost_models.${r}`),
                value: r,
              }))}
              metricChange={(value: string) => {
                send({ type: 'CHANGE_METRIC', payload: { metric: value } });
              }}
              metric={metric}
              measurement={measurement}
              measurementOptions={Object.keys(availableRates[metric]).map(
                m => ({
                  label: t(`cost_models.${m}`, {
                    units: metricsHash[metric][m].label_measurement_unit,
                  }),
                  value: m,
                })
              )}
              measurementChange={(value: string) =>
                send({
                  type: 'CHANGE_MEASUREMENT',
                  payload: {
                    measurement: value,
                    costType: metricsHash[metric][value].default_cost_type,
                  },
                })
              }
              rate={rate}
              rateChange={(value: string) =>
                send({ type: 'CHANGE_RATE', payload: { rate: value } })
              }
              isRateInvalid={
                isNaN(Number(rate)) || rate === '' || Number(rate) <= 0
              }
              isMeasurementInvalid={measurement === ''}
              costTypes={costTypes}
              costType={costType}
              costTypeChange={value =>
                send({
                  type: 'CHANGE_INFRA_COST',
                  payload: { costType: value },
                })
              }
            />
          </>
        );
    }
  }

  public render() {
    const { updateError, current, onClose, t } = this.props;
    return (
      <Modal
        title={t('cost_models_details.add_rate_modal.title', {
          name: current.name,
        })}
        isOpen
        onClose={onClose}
        actions={this.renderActionButtons()}
        variant="small"
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form style={styles.form}>{this.renderForm()}</Form>
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
    costTypes: metricsSelectors.costTypes(state),
  }))
)(translate()(AddRateModelBase));
