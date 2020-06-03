import {
  FormSelect,
  FormSelectOption,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  TextInput,
} from '@patternfly/react-core';
import i18next from 'i18next';
import React from 'react';

interface Props {
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
    const { value, onChange, options, selected } = this.props;
    return (
      <PageHeaderToolsGroup>
        <PageHeaderToolsItem>
          <FormSelect
            aria-label={i18next.t('source_details.filter.type_aria_label')}
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
        </PageHeaderToolsItem>
        <PageHeaderToolsItem>
          <TextInput
            value={value}
            placeholder={i18next.t('cost_models_details.filter.placeholder', {
              value: selected,
            })}
            id="costModelFilterValue"
            onKeyPress={this.checkEnter}
            onChange={onChange('value')}
          />
        </PageHeaderToolsItem>
      </PageHeaderToolsGroup>
    );
  }
}

export default FilterToolbar;
