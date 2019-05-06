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
  selected: string;
  value: string;
  onSearch: (query: { [k: string]: string }) => void;
  onChange: (key: string) => (value: string) => void;
}

class FilterToolbar extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.checkEnter = this.checkEnter.bind(this);
  }

  public checkEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      const { selected, value } = this.props;
      this.props.onSearch({ [selected]: value });
    }
  }

  public render() {
    const { options, t, selected, value } = this.props;
    return (
      <ToolbarGroup>
        <ToolbarItem>
          <FormSelect
            aria-label={t('source_details.filter.type_aria_label')}
            value={selected}
            onChange={this.props.onChange('type')}
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
            value={value}
            placeholder={t('source_details.filter.placeholder', {
              value: selected,
            })}
            id="sources filter value"
            onKeyPress={this.checkEnter}
            onChange={this.props.onChange('value')}
          />
        </ToolbarItem>
      </ToolbarGroup>
    );
  }
}

export default FilterToolbar;
