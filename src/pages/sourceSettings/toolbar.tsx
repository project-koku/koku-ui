import {
  FormSelect,
  FormSelectOption,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  options: { [k: string]: string };
  onSearch?: (query: string) => void;
}

interface State {
  value: string;
  selected: string;
}

class FilterToolbar extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.state = {
      value: '',
      selected: Object.keys(this.props.options)[0],
    };
  }

  public onSelect(selected: string) {
    this.setState({ selected, value: '' });
  }

  public onChange(value: string) {
    this.setState({ value });
  }

  public checkEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      this.props.onSearch(`${this.state.selected}=${this.state.value}`);
    }
  }

  public render() {
    const { value, selected } = this.state;
    const { options, t } = this.props;
    return (
      <ToolbarGroup>
        <ToolbarItem>
          <FormSelect
            aria-label="select property to use for filtering"
            value={selected}
            onChange={this.onSelect}
          >
            {Object.keys(options).map(opt => (
              <FormSelectOption
                key={`option-${opt}`}
                value={opt}
                label={options[opt]}
              />
            ))}
          </FormSelect>
        </ToolbarItem>
        <ToolbarItem>
          <TextInput
            onChange={this.onChange}
            value={value}
            placeholder={`${t(
              'source_details.filter.placeholder'
            )} ${selected}`}
            id="sources filter value"
            onKeyPress={this.checkEnter}
          />
        </ToolbarItem>
      </ToolbarGroup>
    );
  }
}

export default FilterToolbar;
