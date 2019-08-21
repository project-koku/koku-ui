import {
  Button,
  Chip,
  Title,
  TitleSize,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import { flatQueryValue, removeMultiValueQuery } from './filterLogic';

const FilterResults: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({ sources, fetchSources, query, page, perPage, type }) => {
        const activeFilters = Object.keys(query)
          .filter(key => ![null, undefined, '', []].includes(query[key]))
          .map(key => flatQueryValue(key, query[key]))
          .reduce((acc, cur) => [...acc, ...cur], []);
        return (
          <React.Fragment>
            <ToolbarGroup>
              <ToolbarItem>
                <Title size={TitleSize.md}>
                  {t('cost_models_wizard.source_table.results_text', {
                    num: sources.length,
                  })}
                </Title>
              </ToolbarItem>
            </ToolbarGroup>
            {activeFilters.length > 0 && (
              <React.Fragment>
                <ToolbarGroup>
                  <ToolbarItem>
                    {t('cost_models_wizard.source_table.active_filters')}
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    {activeFilters.map((f, ix) => (
                      <Chip
                        style={{ paddingRight: '20px' }}
                        key={`${f.name}-${f.value}-${ix}`}
                        onClick={() =>
                          fetchSources(
                            type,
                            removeMultiValueQuery(query)(f.name, f.value),
                            page,
                            perPage
                          )
                        }
                      >
                        {t(`cost_models_wizard.source_table.column_${f.name}`)}:{' '}
                        {f.value}
                      </Chip>
                    ))}
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      onClick={() => fetchSources(type, {}, page, perPage)}
                      variant="plain"
                    >
                      {t('cost_models_wizard.source_table.clear_all_filters')}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(FilterResults);
