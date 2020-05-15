import {
  FormSelect,
  FormSelectOption,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface Props extends WrappedComponentProps {
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
    this.onSelectType = this.onSelectType.bind(this);
  }

  private checkEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter' && this.props.value) {
      const { selected, value } = this.props;
      this.props.onSearch({ [selected]: value });
    }
  }

  private onSelectType(selectedType) {
    this.props.onSearch({ type: selectedType });
  }

  public render() {
    const { value, onChange, options, selected, intl } = this.props;
    return (
      <ToolbarGroup>
        <ToolbarItem>
          <FormSelect
            aria-label={intl.formatMessage({
              id: 'source_details.filter.type_aria_label',
            })}
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
            placeholder={intl.formatMessage(
              { id: 'cost_models_details.filter.placeholder' },
              {
                value: selected,
              }
            )}
            id="costModelFilterValue"
            onKeyPress={this.checkEnter}
            onChange={onChange('value')}
          />
        </ToolbarItem>
      </ToolbarGroup>
    );
  }
}

export default injectIntl(FilterToolbar);
