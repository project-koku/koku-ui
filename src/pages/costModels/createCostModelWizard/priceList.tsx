import { MetricHash } from 'api/metrics';
import AddPriceList from 'pages/costModels/components/addPriceList';
import { TierData } from 'pages/costModels/components/addPriceList';
import React from 'react';
import { assign, interpret, Machine, State } from 'xstate';
import { CostModelContext } from './context';
import PriceListTable from './priceListTable';

interface PriceListStates {
  states: {
    table: {};
    form: {
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
    };
  };
}

type PriceListEvent =
  | { type: 'SUBMIT'; value: TierData }
  | { type: 'DELETE_RATE'; value: TierData }
  | { type: 'ADD_RATE' }
  | { type: 'CANCEL' };

interface PriceListSelected {
  items: TierData[];
}

type PriceListContext = PriceListSelected;

interface PriceListMachineParams {
  items: TierData[];
  // HACK: sideEffectSubmit is to changes in price list state sync with the big state. Should be removed once migrating all wizard to state machine.
  sideEffectSubmit?: (tds: TierData[]) => void;
  // HACK: sideEffectEnabler is to enable or disable the Next button in wizard. Should be removed once migrating all wizard to state machine.
  sideEffectEnabler?: (value: boolean) => void;
}

const priceListMachine = ({
  items,
  sideEffectSubmit,
  sideEffectEnabler,
}: PriceListMachineParams) =>
  Machine<PriceListContext, PriceListStates, PriceListEvent>(
    {
      id: 'price-list-step-machine',
      context: {
        items,
      },
      initial: 'table',
      states: {
        table: {
          entry: ['enableNext'],
          on: {
            ADD_RATE: 'form',
            DELETE_RATE: [
              {
                target: 'form',
                actions: ['deleteRate'],
                cond: 'isEmpty',
              },
              {
                target: 'table',
                actions: ['deleteRate'],
              },
            ],
          },
        },
        form: {
          entry: ['disableNext'],
          on: {
            SUBMIT: {
              target: 'table',
              actions: ['addNewRate'],
            },
            CANCEL: 'table',
          },
        },
      },
    },
    {
      actions: {
        enableNext: (ctx, _evt) => {
          if (sideEffectSubmit) {
            sideEffectSubmit(ctx.items);
          }
          if (sideEffectEnabler) {
            sideEffectEnabler(true);
          }
        },
        disableNext: (_ctx, _evt) => {
          if (sideEffectEnabler) {
            sideEffectEnabler(false);
          }
        },
        deleteRate: assign({
          items: (ctx, evt) => {
            if (evt.type !== 'DELETE_RATE') {
              return ctx.items;
            }
            const ixToSlice = ctx.items.findIndex(
              tier =>
                tier.metric === evt.value.metric &&
                tier.measurement === evt.value.measurement
            );
            if (ixToSlice === -1) {
              return ctx.items;
            }
            return [
              ...ctx.items.slice(0, ixToSlice),
              ...ctx.items.slice(ixToSlice + 1),
            ];
          },
        }),
        addNewRate: assign({
          items: (ctx, evt) => {
            if (evt.type !== 'SUBMIT') {
              return ctx.items;
            }
            return [...ctx.items, evt.value];
          },
        }),
      },
      guards: {
        isEmpty: (ctx, evt) => {
          if (evt.type !== 'DELETE_RATE') {
            return false;
          }
          const { items: tiers } = ctx;
          const { measurement, metric } = evt.value;
          return Boolean(
            tiers.length === 1 &&
              tiers[0].metric === metric &&
              tiers[0].measurement === measurement
          );
        },
      },
    }
  );

interface PriceListBaseProps {
  items: TierData[];
  submit: (data) => void;
  metricsHash: MetricHash;
  setNextButton?: (enable: boolean) => void;
}

type CurrentStateMachine = State<
  PriceListContext,
  PriceListEvent,
  PriceListStates
>;

interface PriceListBaseState {
  current: CurrentStateMachine;
}

export class PirceListBase extends React.Component<
  PriceListBaseProps,
  PriceListBaseState
> {
  public state = {
    current: null as CurrentStateMachine,
  };
  public service = null;

  constructor(props) {
    super(props);
    const { items, setNextButton, submit } = props;
    const stateMachine = priceListMachine({
      items,
      sideEffectSubmit: submit,
      sideEffectEnabler: setNextButton,
    });
    this.state = {
      current: stateMachine.initialState,
    };
    this.service = interpret(stateMachine).onTransition(current =>
      this.setState({ current })
    );
  }

  public componentDidMount() {
    this.service.start();
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    const { metricsHash } = this.props;
    const { current } = this.state;
    const { send } = this.service;
    const stateName = current.toStrings()[0];

    const { items } = current.context;

    switch (stateName) {
      case 'table':
        return (
          <PriceListTable
            items={items}
            deleteRateAction={data =>
              send({ type: 'DELETE_RATE', value: data })
            }
            addRateAction={() => send('ADD_RATE')}
          />
        );
      case 'form':
        return (
          <AddPriceList
            metricsHash={metricsHash}
            items={items}
            submitRate={data => send({ type: 'SUBMIT', value: data })}
            cancel={() => send('CANCEL')}
          />
        );
      default:
        return null;
    }
  }
}

const PriceList = () => {
  return (
    <CostModelContext.Consumer>
      {({ metricsHash, goToAddPL, submitTiers, tiers }) => {
        return (
          <PirceListBase
            items={tiers}
            metricsHash={metricsHash}
            setNextButton={(value: boolean) => goToAddPL(value)}
            submit={newTiers => submitTiers(newTiers)}
          />
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default PriceList;
