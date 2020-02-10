import {
  Button,
  ButtonProps,
  Pagination,
  PaginationProps,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarItem,
  DataToolbarItemVariant,
} from '@patternfly/react-core/dist/esm/experimental';
import { Option } from 'components/priceList/types';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
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
          <Button {...buttonProps} />
        </DataToolbarItem>
        <DataToolbarItem
          variant={DataToolbarItemVariant.pagination}
          breakpointMods={[{ modifier: 'align-right' }]}
        >
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

const toolbarMachine = onSelect =>
  Machine<
    undefined,
    PriceListToolbarMachineState,
    PriceListToolbarMachineEvents
  >(
    {
      initial: 'metric',
      type: 'parallel',
      states: {
        // metric: filterSelectorMachineData('metrics'),
        // measurement: filterSelectorMachineData('measurements'),
        metric: {
          initial: 'collapsed',
          states: {
            expanded: {
              on: {
                TOGGLE_METRICS: 'collapsed',
                SELECT_METRICS: {
                  actions: ['updateSelection'],
                },
              },
            },
            collapsed: {
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
              on: {
                TOGGLE_MEASUREMENTS: 'collapsed',
                SELECT_MEASUREMENTS: {
                  actions: ['updateSelection'],
                },
              },
            },
            collapsed: {
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

interface PriceListToolbarProps extends InjectedTranslateProps {
  metricOpts: Option[];
  measurOpts: Option[];
  metricSelection: string[];
  measurementSelection: string[];
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
      t,
      pagination,
      enableAddRate,
      onClick,
      measurOpts,
      metricOpts,
      metricSelection,
      measurementSelection,
      filters,
      onClear,
      onRemoveFilter,
    } = this.props;
    return (
      <PriceListToolbarBase
        metricsFilterProps={{
          selections: metricSelection,
          onToggle: () => send('TOGGLE_METRICS'),
          onSelect: (_event, selection) =>
            send({ type: 'SELECT_METRICS', selection }),
          isExpanded: current.matches('metric.expanded'),
          placeholder: t('toolbar.pricelist.metric_placeholder'),
          options: metricOpts,
        }}
        measurementsFilterProps={{
          selections: measurementSelection,
          onToggle: () => send('TOGGLE_MEASUREMENTS'),
          onSelect: (_event, selection) =>
            send({ type: 'SELECT_MEASUREMENTS', selection }),
          isExpanded: current.matches('measurement.expanded'),
          placeholder: t('toolbar.pricelist.measurement_placeholder'),
          options: measurOpts,
        }}
        paginationProps={pagination}
        buttonProps={{
          children: t('toolbar.pricelist.add_rate'),
          onClick,
          isDisabled: enableAddRate,
        }}
        filters={filters}
        categoryNames={{
          metrics: t('toolbar.pricelist.metric_placeholder'),
          measurements: t('toolbar.pricelist.measurement_placeholder'),
        }}
        onClear={onClear}
        onRemoveFilter={onRemoveFilter}
      />
    );
  }
}
