import React from 'react';

import { checkBoxLogic, deleteChip } from '../logic/selectCheckbox';

export interface PriceListSearchQuery {
  primary: string;
  metrics?: string[];
  measurements?: string[];
}

export interface WithPriceListSearchPropsRender {
  search: PriceListSearchQuery;
  setSearch: (newSearch: PriceListSearchQuery) => void;
  onRemove: (category: string, chip: string) => void;
  onSelect: (key: string, value: string) => void;
  onClearAll: () => void;
}

export interface WithPriceListSearchProps {
  initialFilters?: PriceListSearchQuery;
  children: (props: WithPriceListSearchPropsRender) => JSX.Element;
}

interface WithPriceListSearchState {
  filters: PriceListSearchQuery;
}

export class WithPriceListSearch extends React.Component<WithPriceListSearchProps, WithPriceListSearchState> {
  constructor(props) {
    super(props);
    this.state = { filters: this.props.initialFilters };
    this.handleChange = this.handleChange.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
  }

  public handleChange(newSearch: PriceListSearchQuery) {
    this.setState({
      filters: { ...this.state.filters, ...newSearch },
    });
  }

  public onClearAll() {
    this.setState({
      filters: {
        ...this.state.filters,
        metrics: [],
        measurements: [],
      },
    });
  }

  public onRemove(category: string, chip: string) {
    this.setState({
      filters: {
        ...this.state.filters,
        [category]: deleteChip(this.state.filters[category], chip),
      },
    });
  }

  public onSelect(key: string, value: string) {
    this.setState({
      filters: {
        ...this.state.filters,
        [key]: checkBoxLogic(this.state.filters[key], value),
      },
    });
  }

  public render() {
    return this.props.children({
      onClearAll: this.onClearAll,
      onRemove: this.onRemove,
      onSelect: this.onSelect,
      setSearch: this.handleChange,
      search: this.state.filters,
    });
  }
}
