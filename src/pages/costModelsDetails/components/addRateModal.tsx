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
  TitleSize,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { interpret } from 'xstate';
import {
  addRateMachine,
  CurrentStateMachine,
} from '../../createCostModelWizard/addPriceList';
import { styles } from '../../createCostModelWizard/wizard.styles';
import {
  SetMeasurement,
  SetMetric,
  SetRate,
  unusedRates,
} from './addCostModelRateForm';

interface Props extends InjectedTranslateProps {
  current: CostModel;
  isProcessing?: boolean;
  onClose: () => void;
  onProceed: (metric: string, measurement: string, rate: string) => void;
  updateError: string;
  metricsHash: MetricHash;
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
        context: { metric, measurement, rate },
      },
    } = this.state;

    if (current.matches('setRate.valid')) {
      const ValidCancelButton = (
        <Button
          key="cancel"
          variant={ButtonVariant.secondary}
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
          onClick={() => onProceed(metric, measurement, rate)}
          isDisabled={isProcessing}
        >
          {t('cost_models_details.add_rate')}
        </Button>
      );
      return [ValidCancelButton, ValidOkButton];
    }
    const CancelButton = (
      <Button key="cancel" variant={ButtonVariant.secondary} onClick={onClose}>
        {t('cost_models_details.add_rate_modal.cancel')}
      </Button>
    );
    const OkButton = (
      <Button key="proceed" variant={ButtonVariant.primary} isDisabled>
        {t('cost_models_details.add_rate')}
      </Button>
    );
    return [CancelButton, OkButton];
  }

  public renderForm() {
    const {
      current: {
        context: { metric, measurement, rate },
      },
    } = this.state;
    const { metricsHash, current, t } = this.props;
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
              label: r,
              value: r,
            }))}
            onChange={(value: string) => send({ type: 'CHANGE_METRIC', value })}
            value={metric}
          />
        );
      case 'setMeasurement':
        return (
          <SetMeasurement
            t={t}
            metricOptions={Object.keys(availableRates).map(r => ({
              label: r,
              value: r,
            }))}
            metricChange={(value: string) =>
              send({ type: 'CHANGE_METRIC', value })
            }
            metric={metric}
            measurementOptions={Object.keys(availableRates[metric] || {}).map(
              m => ({
                label: m,
                value: m,
              })
            )}
            measurement={measurement}
            measurementChange={(value: string) =>
              send({ type: 'CHANGE_MEASUREMENT', value })
            }
          />
        );
      case 'setRate.init':
        return (
          <>
            <SetRate
              t={t}
              metricOptions={Object.keys(availableRates).map(r => ({
                label: r,
                value: r,
              }))}
              metricChange={(value: string) =>
                send({ type: 'CHANGE_METRIC', value })
              }
              metric={metric}
              measurementOptions={Object.keys(availableRates[metric] || {}).map(
                m => ({ label: m, value: m })
              )}
              measurement={measurement}
              measurementChange={(value: string) =>
                send({ type: 'CHANGE_MEASUREMENT', value })
              }
              rate={rate}
              rateChange={(value: string) =>
                send({ type: 'CHANGE_RATE', value })
              }
              isRateInvalid={false}
              isMeasurementInvalid={false}
            />
          </>
        );
      case 'setRate.valid':
        return (
          <>
            <SetRate
              t={t}
              metricOptions={Object.keys(availableRates).map(r => ({
                label: r,
                value: r,
              }))}
              metricChange={(value: string) =>
                send({ type: 'CHANGE_METRIC', value })
              }
              metric={metric}
              measurementOptions={Object.keys(availableRates[metric] || {}).map(
                m => ({ label: m, value: m })
              )}
              measurement={measurement}
              measurementChange={(value: string) =>
                send({ type: 'CHANGE_MEASUREMENT', value })
              }
              rate={rate}
              rateChange={(value: string) =>
                send({ type: 'CHANGE_RATE', value })
              }
              isRateInvalid={false}
              isMeasurementInvalid={false}
            />
          </>
        );
      case 'setRate.invalid':
        return (
          <>
            <SetRate
              t={t}
              metricOptions={Object.keys(availableRates).map(r => ({
                label: r,
                value: r,
              }))}
              metricChange={(value: string) =>
                send({ type: 'CHANGE_METRIC', value })
              }
              metric={metric}
              measurementOptions={Object.keys(availableRates[metric]).map(
                m => ({ label: m, value: m })
              )}
              measurement={measurement}
              measurementChange={(value: string) =>
                send({ type: 'CHANGE_MEASUREMENT', value })
              }
              rate={rate}
              rateChange={(value: string) =>
                send({ type: 'CHANGE_RATE', value })
              }
              isRateInvalid={
                isNaN(Number(rate)) || rate === '' || Number(rate) <= 0
              }
              isMeasurementInvalid={measurement === ''}
            />
          </>
        );
    }
  }

  public render() {
    const { updateError, current, onClose, t } = this.props;
    return (
      <Modal
        isFooterLeftAligned
        title={t('cost_models_details.add_rate_modal.title', {
          name: current.name,
        })}
        isSmall
        isOpen
        onClose={onClose}
        actions={this.renderActionButtons()}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form className={css(styles.form)}>{this.renderForm()}</Form>
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
  }))
)(translate()(AddRateModelBase));
