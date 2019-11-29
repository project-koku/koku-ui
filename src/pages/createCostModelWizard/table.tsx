import {
  Pagination,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { CostModelContext } from './context';
import FilterResults from './filterResults';
import FilterToolbar from './filterToolbar';

const SourcesTable: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({
        loading,
        onSourceSelect,
        sources,
        perPage,
        page,
        type,
        query,
        fetchSources,
      }) => {
        return (
          <Stack gutter="md">
            <StackItem>
              <Title size="xl">{t('cost_models_wizard.source.title')}</Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t('cost_models_wizard.source.sub_title')}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h3}>
                  {t('cost_models_wizard.source.caption', {
                    type: t(`source_details.type.${type}`),
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Toolbar>
                <ToolbarSection
                  aria-label={t(
                    'cost_models_wizard.source_table.filter_section_aria_label'
                  )}
                >
                  <FilterToolbar isSingleOption />
                  <ToolbarGroup style={{ marginLeft: 'auto' }}>
                    <ToolbarItem>
                      <Pagination
                        isCompact
                        itemCount={sources.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_evt, newPage) => {
                          fetchSources(type, query, newPage, perPage);
                        }}
                        onPerPageSelect={(_evt, newPerPage) =>
                          fetchSources(type, query, 1, newPerPage)
                        }
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarSection>
                <ToolbarSection
                  aria-label={t(
                    'cost_models_wizard.source_table.toolbar_results_section'
                  )}
                >
                  <FilterResults />
                </ToolbarSection>
              </Toolbar>
              {loading ? (
                <LoadingState />
              ) : (
                <Table
                  aria-label={t(
                    'cost_models_wizard.source_table.table_aria_label'
                  )}
                  cells={[
                    t('cost_models_wizard.source_table.column_name'),
                    t('cost_models_wizard.source_table.column_cost_model'),
                  ]}
                  onSelect={(evt, isSelected, rowId) =>
                    onSourceSelect(rowId, isSelected)
                  }
                  rows={sources.map(r => {
                    return {
                      cells: [
                        r.name,
                        r.costmodel ||
                          t(
                            'cost_models_wizard.source_table.default_cost_model'
                          ),
                      ],
                      selected: r.selected,
                    };
                  })}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
              <Toolbar>
                <ToolbarSection
                  aria-label={t(
                    'cost_models_wizard.source_table.pagination_section_aria_label'
                  )}
                >
                  <ToolbarGroup style={{ marginLeft: 'auto' }}>
                    <ToolbarItem>
                      <Pagination
                        itemCount={sources.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_evt, newPage) => {
                          fetchSources(type, query, newPage, perPage);
                        }}
                        onPerPageSelect={(_evt, newPerPage) =>
                          fetchSources(type, query, 1, newPerPage)
                        }
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarSection>
              </Toolbar>
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default translate()(SourcesTable);
