import {
  FormSelect,
  FormSelectOption,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { addMultiValueQuery } from './filterLogic';

const FilterToolbar: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({
        filterName,
        onFilterChange,
        page,
        perPage,
        query,
        type,
        fetchSources,
      }) => {
        return (
          <ToolbarGroup>
            <ToolbarItem>
              <FormSelect
                aria-label={t(
                  'cost_models_wizard.source_table.select_filter_type'
                )}
              >
                <FormSelectOption
                  value="name"
                  label={t('cost_models_wizard.source_table.name_label')}
                />
              </FormSelect>
            </ToolbarItem>
            <ToolbarItem>
              <TextInput
                value={filterName}
                placeholder={t(
                  'cost_models_wizard.source_table.filter_placeholder'
                )}
                id="sources filter value"
                onChange={onFilterChange}
                onKeyPress={evt => {
                  if (evt.key !== 'Enter' || filterName === '') {
                    return;
                  }
                  fetchSources(
                    type,
                    addMultiValueQuery(query)('name', filterName),
                    page,
                    perPage
                  );
                }}
              />
            </ToolbarItem>
          </ToolbarGroup>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(FilterToolbar);
