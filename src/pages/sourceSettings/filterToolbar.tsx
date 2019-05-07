import {
  FormSelect,
  FormSelectOption,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
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

  private renderInput() {
    const { selected, value, onChange } = this.props;
    switch (selected) {
      case 'type':
        return (
          <FormSelect
            aria-label={i18next.t(
              'source_details.filter.type_options_aria_label'
            )}
            value={value}
            onChange={this.onSelectType}
          >
            <FormSelectOption
              key={`type-option-empty`}
              value={''}
              label={'Choose source type'}
            />
            <FormSelectOption
              key={`type-option-openshift`}
              value={'OCP'}
              label={i18next.t('source_details.type.OCP')}
            />
            <FormSelectOption
              key={`type-option-aws`}
              value={'AWS'}
              label={i18next.t('source_details.type.AWS')}
            />
          </FormSelect>
        );
      default:
        return (
          <TextInput
            value={value}
            placeholder={i18next.t('source_details.filter.placeholder', {
              value: selected,
            })}
            id="sources filter value"
            onKeyPress={this.checkEnter}
            onChange={onChange('value')}
          />
        );
    }
  }

  public render() {
    const { options, selected } = this.props;
    return (
      <ToolbarGroup>
        <ToolbarItem>
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
        </ToolbarItem>
        <ToolbarItem>{this.renderInput()}</ToolbarItem>
      </ToolbarGroup>
    );
  }
}

export default FilterToolbar;
