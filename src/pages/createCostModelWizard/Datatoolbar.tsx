import {
  Button,
  ButtonProps,
  DataToolbar,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarItem,
  DataToolbarItemVariant,
  Pagination,
  PaginationProps,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import { Option } from 'components/priceList/types';
import { ReadOnlyTooltip } from 'pages/costModelsDetails/components/readOnlyTooltip';
import React from 'react';
import { interpret, Machine, State } from 'xstate';

interface SelectFilterProps {
  selections: string[];
  onToggle: (isExpanded: boolean) => void;
  onSelect: (event: React.MouseEvent, selection: string) => void;
  isExpanded: boolean;
  placeholder: string;
  options: Option[];
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  selections,
  onToggle,
  onSelect,
  isExpanded,
  placeholder,
  options,
}) => {
  return (
    <Select
      variant={SelectVariant.checkbox}
      onToggle={onToggle}
      onSelect={onSelect}
      selections={selections}
      isExpanded={isExpanded}
      placeholderText={placeholder}
    >
      {options.map(opt => (
        <SelectOption key={opt.value} value={opt.value}>
          {opt.label}
        </SelectOption>
      ))}
    </Select>
  );
};

interface PriceListToolbarBaseProps {
  metricsFilterProps: SelectFilterProps;
  measurementsFilterProps: SelectFilterProps;
  paginationProps: PaginationProps;
  buttonProps: ButtonProps;
  filters: { [k: string]: string[] };
  categoryNames: { [k: string]: string };
  onClear: () => void;
  onRemoveFilter: (type: string, id: string) => void;
}

export const PriceListToolbarBase: React.FC<PriceListToolbarBaseProps> = ({
  buttonProps,
  paginationProps,
  metricsFilterProps,
  measurementsFilterProps,
  filters,
  categoryNames,
  onClear,
  onRemoveFilter,
}) => {
  return (
    <DataToolbar
      clearAllFilters={onClear}
      id="price-list-toolbar"
      style={{ marginBottom: '10px', marginTop: '10px' }}
    >
      <DataToolbarContent>
        <DataToolbarItem>
          <DataToolbarFilter
            deleteChip={onRemoveFilter}
            chips={filters.metrics}
            categoryName={categoryNames.metrics}
          >
            <SelectFilter {...metricsFilterProps} />
          </DataToolbarFilter>
        </DataToolbarItem>
        <DataToolbarItem>
          <DataToolbarFilter
            deleteChip={onRemoveFilter}
            chips={filters.measurements}
            categoryName={categoryNames.measurements}
          >
            <SelectFilter {...measurementsFilterProps} />
          </DataToolbarFilter>
        </DataToolbarItem>
        <DataToolbarItem>
          <ReadOnlyTooltip isDisabled={buttonProps.isDisabled}>
            <Button {...buttonProps} />
          </ReadOnlyTooltip>
        </DataToolbarItem>
        <DataToolbarItem variant={DataToolbarItemVariant.pagination}>
          <Pagination {...paginationProps} />
        </DataToolbarItem>
      </DataToolbarContent>
    </DataToolbar>
  );
};

interface PriceListToolbarMachineState {
  states: {
    metric: {
      states: {
        collapsed: {};
        expanded: {};
      };
    };
    measurement: {
      states: {
        collapsed: {};
        expanded: {};
      };
    };
  };
}

type PriceListToolbarMachineEvents =
  | { type: 'TOGGLE_METRICS' }
  | { type: 'TOGGLE_MEASUREMENTS' }
  | { type: 'SELECT_METRICS'; selection: string }
  | { type: 'SELECT_MEASUREMENTS'; selection: string };

export const toolbarMachine = onSelect =>
  Machine<
    undefined,
    PriceListToolbarMachineState,
    PriceListToolbarMachineEvents
  >(
    {
      initial: 'metric',
      type: 'parallel',
      states: {
        metric: {
          initial: 'collapsed',
          states: {
            expanded: {
              meta: {
                test: ({ queryAllByText }) => {
                  expect(queryAllByText('CPU').length).toBe(1);
                },
              },
              on: {
                TOGGLE_METRICS: 'collapsed',
                SELECT_METRICS: {
                  actions: ['updateSelection'],
                },
              },
            },
            collapsed: {
              meta: {
                test: ({ queryAllByText }) => {
                  expect(queryAllByText('CPU').length).toBe(0);
                },
              },
              on: {
                TOGGLE_METRICS: 'expanded',
              },
            },
          },
        },
        measurement: {
          initial: 'collapsed',
          states: {
            expanded: {
              meta: {
                test: ({ queryAllByText }) => {
                  expect(queryAllByText('Request').length).toBe(1);
                },
              },
              on: {
                TOGGLE_MEASUREMENTS: 'collapsed',
                SELECT_MEASUREMENTS: {
                  actions: ['updateSelection'],
                },
              },
            },
            collapsed: {
              meta: {
                test: ({ queryAllByText }) => {
                  expect(queryAllByText('Request').length).toBe(0);
                },
              },
              on: {
                TOGGLE_MEASUREMENTS: 'expanded',
              },
            },
          },
        },
      },
    },
    {
      actions: {
        updateSelection: (_ctx, evt) => onSelect(evt),
      },
    }
  );

interface PriceListToolbarProps {
  metricProps: {
    options: Option[];
    selection: string[];
    placeholder: string;
  };
  measurementProps: {
    options: Option[];
    selection: string[];
    placeholder: string;
  };
  actionButtonText: string;
  actionButtonDisabled?: boolean;
  onSelect: (event: { [k: string]: string }) => void;
  onClick: () => void;
  pagination: PaginationProps;
  enableAddRate?: boolean;
  filters: { [k: string]: string[] };
  onClear: () => void;
  onRemoveFilter: (type: string, id: string) => void;
}

interface PriceListToolbarState {
  current: State<
    any,
    PriceListToolbarMachineEvents,
    PriceListToolbarMachineState,
    any
  >;
}

export class PriceListToolbar extends React.Component<
  PriceListToolbarProps,
  PriceListToolbarState
> {
  public service = null;
  public state = {
    current: null,
  };

  constructor(props) {
    super(props);
    const machine = toolbarMachine(props.onSelect);
    this.service = interpret(machine).onTransition(current =>
      this.setState({ current })
    );
    this.state = { current: machine.initialState };
  }

  public componentDidMount() {
    this.service.start();
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    const { send } = this.service;
    const { current } = this.state;
    const {
      pagination,
      enableAddRate,
      onClick,
      metricProps,
      measurementProps,
      filters,
      onClear,
      onRemoveFilter,
      actionButtonText,
      actionButtonDisabled,
    } = this.props;
    return (
      <PriceListToolbarBase
        metricsFilterProps={{
          selections: metricProps.selection,
          onToggle: () => send('TOGGLE_METRICS'),
          onSelect: (_event, selection) =>
            send({ type: 'SELECT_METRICS', selection }),
          isExpanded: current.matches('metric.expanded'),
          placeholder: metricProps.placeholder,
          options: metricProps.options,
        }}
        measurementsFilterProps={{
          selections: measurementProps.selection,
          onToggle: () => send('TOGGLE_MEASUREMENTS'),
          onSelect: (_event, selection) =>
            send({ type: 'SELECT_MEASUREMENTS', selection }),
          isExpanded: current.matches('measurement.expanded'),
          placeholder: measurementProps.placeholder,
          options: measurementProps.options,
        }}
        paginationProps={pagination}
        buttonProps={{
          children: actionButtonText,
          onClick,
          isDisabled: actionButtonDisabled ? true : enableAddRate,
        }}
        filters={filters}
        categoryNames={{
          metrics: metricProps.placeholder,
          measurements: measurementProps.placeholder,
        }}
        onClear={onClear}
        onRemoveFilter={onRemoveFilter}
      />
    );
  }
}
