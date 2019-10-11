import {
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  TextInput,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { addMultiValueQuery } from './filterLogic';

interface Props extends InjectedTranslateProps {
  isSingleOption?: boolean;
}

const FilterToolbar: React.SFC<Props> = ({ t, isSingleOption = false }) => {
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
            {!isSingleOption && (
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
            )}
            <ToolbarItem>
              <InputGroup>
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
                <InputGroupText style={{ borderLeft: '0' }}>
                  <SearchIcon />
                </InputGroupText>
              </InputGroup>
            </ToolbarItem>
          </ToolbarGroup>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(FilterToolbar);
