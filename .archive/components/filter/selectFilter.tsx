import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import React from 'react';

interface State {
  isExpanded: boolean;
}

interface SelectOptType {
  name: string;
  value: string;
}

interface Props {
  selected: string;
  options: SelectOptType[];
  onSelect: (value: string) => void;
}

class SelectFilter extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  public onToggle(isExpanded) {
    this.setState({ isExpanded });
  }

  public onSelect(_event, selection) {
    this.onToggle(false);
    this.props.onSelect(selection);
  }

  public render() {
    const { selected, options } = this.props;
    return (
      <Select
        variant={SelectVariant.single}
        aria-label="select filter type"
        selections={selected}
        onToggle={this.onToggle}
        onSelect={this.onSelect}
        isOpen={this.state.isExpanded}
      >
        {options.map((opt, ix) => {
          return <SelectOption key={`filter-type-opt-${ix}`} value={opt.name} id={opt.value} />;
        })}
      </Select>
    );
  }
}

export default SelectFilter;
