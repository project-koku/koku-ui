import {
  ActionGroup,
  Button,
  ButtonVariant,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { Metric, MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect, Omit } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { metricsSelectors } from 'store/metrics';
import { assign, interpret, Machine, State } from 'xstate';
import {
  SetMeasurement,
  SetMetric,
  SetRate,
  unusedRates,
} from './addCostModelRateForm';
import { styles } from './addPriceList.styles';

export interface TierData {
  metric: string;
  measurement: string;
  rate: string;
  costType: string;
  meta: Metric;
}

export type SubmitPayload = TierData;

interface AddRateStates {
  states: {
    setMetric: {};
    setMeasurement: {};
    setRate: {
      states: {
        invalid: {};
        valid: {};
        init: {};
      };
    };
  };
}

type AddRateEventPayload = Partial<TierData>;

type AddRateEvents =
  | { type: 'CHANGE_METRIC'; payload: AddRateEventPayload }
  | { type: 'CHANGE_MEASUREMENT'; payload: AddRateEventPayload }
  | { type: 'CHANGE_RATE'; payload: AddRateEventPayload }
  | { type: 'CHANGE_INFRA_COST'; payload: AddRateEventPayload };

type AddRateContext = Omit<TierData, 'meta'>;

export const addRateMachine = Machine<
  AddRateContext,
  AddRateStates,
  AddRateEvents
>(
  {
    id: 'add-new-rate-machine',
    context: {
      rate: '',
      metric: '',
      measurement: '',
      costType: '',
    },
    initial: 'setMetric',
    states: {
      setMetric: {
        on: {
          CHANGE_METRIC: {
            target: 'setMeasurement',
            actions: ['metric'],
          },
        },
        meta: {
          test: ({ queryAllByLabelText }) => {
            const metricSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.metric_select'
            );
            expect(metricSelectors.length).toBe(1);
            const measurementSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.measurement_select'
            );
            expect(measurementSelectors.length).toBe(0);
            const rateInputs = queryAllByLabelText(
              'cost_models.add_rate_form.rate_inputs'
            );
            expect(rateInputs.length).toBe(0);
          },
        },
      },
      setMeasurement: {
        on: {
          CHANGE_METRIC: {
            target: 'setMeasurement',
            actions: ['metric', 'resetMeasurement'],
          },
          CHANGE_MEASUREMENT: {
            target: 'setRate',
            actions: ['measurement'],
          },
        },
        meta: {
          test: ({ queryAllByLabelText }) => {
            const metricSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.metric_select'
            );
            expect(metricSelectors.length).toBe(1);
            const measurementSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.measurement_select'
            );
            expect(measurementSelectors.length).toBe(1);
            const rateInputs = queryAllByLabelText(
              'cost_models.add_rate_form.rate_inputs'
            );
            expect(rateInputs.length).toBe(0);
          },
        },
      },
      setRate: {
        initial: 'init',
        on: {
          CHANGE_METRIC: [
            {
              target: '.invalid',
              actions: ['metric', 'resetMeasurement'],
            },
          ],
          CHANGE_MEASUREMENT: [
            {
              target: '.valid',
              actions: ['measurement'],
              cond: 'isValid',
            },
            {
              target: '.invalid',
              actions: ['measurement'],
            },
          ],
          CHANGE_INFRA_COST: {
            actions: ['cost_type'],
          },
          CHANGE_RATE: [
            {
              target: '.valid',
              actions: ['rate'],
              cond: 'isValid',
            },
            {
              target: '.invalid',
              actions: ['rate'],
            },
          ],
        },
        meta: {
          test: ({ queryAllByLabelText }) => {
            const metricSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.metric_select'
            );
            expect(metricSelectors.length).toBe(1);
            const measurementSelectors = queryAllByLabelText(
              'cost_models.add_rate_form.measurement_select'
            );
            expect(measurementSelectors.length).toBe(1);
            const rateInputs = queryAllByLabelText(
              'cost_models.add_rate_form.rate_input'
            );
            expect(rateInputs.length).toBe(1);
          },
        },
        states: {
          invalid: {},
          valid: {},
          init: {},
        },
      },
    },
  },
  {
    actions: {
      metric: assign({
        metric: (_ctx, evt) => evt.payload && evt.payload.metric,
      }),
      measurement: assign({
        measurement: (_ctx, evt) => evt.payload && evt.payload.measurement,
        costType: (_ctx, evt) => evt.payload && evt.payload.costType,
      }),
      rate: assign({
        rate: (_ctx, evt) => evt.payload && evt.payload.rate,
      }),
      resetMeasurement: assign({
        measurement: (_ctx, _evt) => '',
        costType: (_ctx, _evt) => 'Supplementary',
      }),
      cost_type: assign({
        costType: (_ctx, evt) => evt.payload && evt.payload.costType,
      }),
    },
    guards: {
      isValid: (ctx, evt) => {
        const rateNumber = Number(ctx.rate);
        switch (evt.type) {
          case 'CHANGE_METRIC':
            return (
              !isNaN(rateNumber) &&
              rateNumber > 0 &&
              ctx.rate !== '' &&
              evt.payload &&
              evt.payload.metric !== ''
            );
          case 'CHANGE_MEASUREMENT':
            return (
              !isNaN(rateNumber) &&
              rateNumber > 0 &&
              ctx.rate !== '' &&
              evt.payload &&
              evt.payload.measurement !== ''
            );
          case 'CHANGE_RATE':
            return (
              evt.payload &&
              !isNaN(Number(evt.payload.rate)) &&
              Number(evt.payload.rate) > 0 &&
              ctx.measurement !== '' &&
              evt.payload &&
              evt.payload.rate !== ''
            );
        }
      },
    },
  }
);

interface AddPriceListBaseProps extends InjectedTranslateProps {
  costTypes: string[];
  metricsHash: MetricHash;
  submitRate: (data: SubmitPayload) => void;
  cancel: () => void;
  items: TierData[];
}

export type CurrentStateMachine = State<
  AddRateContext,
  AddRateEvents,
  AddRateStates
>;

interface AddPriceListBaseState {
  current: CurrentStateMachine;
}

export class AddPriceListBase extends React.Component<
  AddPriceListBaseProps,
  AddPriceListBaseState
> {
  public state = {
    current: addRateMachine.initialState,
  };
  public service = interpret(addRateMachine).onTransition(current =>
    this.setState({ current })
  );

  public componentDidMount() {
    this.service.start();
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public renderForm() {
    const {
      current: {
        context: { metric, measurement, rate, costType },
      },
    } = this.state;
    const { t, items, metricsHash, costTypes } = this.props;
    const { send } = this.service;
    const stateNames = this.state.current.toStrings();
    const mainState = stateNames.length > 1 ? stateNames[1] : stateNames[0];

    const availableRates = unusedRates(metricsHash, items);

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
            measurement={measurement}
            measurementOptions={Object.keys(availableRates[metric]).map(m => ({
              label: t(`cost_models.${m}`, {
                units: metricsHash[metric][m].label_measurement_unit,
              }),
              value: m,
            }))}
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
              send({ type: 'CHANGE_INFRA_COST', payload: { costType: value } })
            }
          />
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
              metricChange={(value: string) =>
                send({ type: 'CHANGE_METRIC', payload: { metric: value } })
              }
              metric={metric}
              measurementOptions={Object.keys(availableRates[metric]).map(
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

  public renderActions() {
    const { t, metricsHash, submitRate, cancel } = this.props;
    const {
      current,
      current: {
        context: { metric, measurement, rate, costType },
      },
    } = this.state;

    if (current.matches('setRate.valid')) {
      return (
        <ActionGroup>
          <Button
            data-testid="add-rate-enable"
            variant={ButtonVariant.primary}
            onClick={() =>
              submitRate({
                metric,
                measurement,
                rate,
                costType,
                meta: metricsHash[metric][measurement],
              })
            }
          >
            {t('cost_models_wizard.price_list.add_rate')}
          </Button>
          <Button variant={ButtonVariant.link} onClick={cancel}>
            {t('cost_models_wizard.price_list.cancel')}
          </Button>
        </ActionGroup>
      );
    }
    return (
      <ActionGroup>
        <Button
          data-testid="add-rate-disabled"
          variant={ButtonVariant.primary}
          isDisabled
        >
          {t('cost_models_wizard.price_list.add_rate')}
        </Button>
        <Button variant={ButtonVariant.link} onClick={cancel}>
          {t('cost_models_wizard.price_list.cancel')}
        </Button>
      </ActionGroup>
    );
  }

  public render() {
    const { t } = this.props;

    return (
      <Stack gutter="md">
        <StackItem>
          <Title size={TitleSize.xl}>
            {t('cost_models_wizard.price_list.title')}
          </Title>
        </StackItem>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.h6}>
              {t('cost_models_wizard.price_list.sub_title_add')}
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <Form style={styles.form}>{this.renderForm()}</Form>
        </StackItem>
        <StackItem>{this.renderActions()}</StackItem>
      </Stack>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    costTypes: metricsSelectors.costTypes(state),
  }))
)(translate()(AddPriceListBase));
