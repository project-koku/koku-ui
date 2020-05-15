import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarGroup,
  DataToolbarItem,
  Pagination,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { LoadingState } from 'components/state/loadingState/loadingState';
import {
  addMultiValueQuery,
  removeMultiValueQuery,
} from 'pages/costModels/components/filterLogic';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { AssignSourcesToolbar } from './assignSourcesToolbar';
import { CostModelContext } from './context';

const SourcesTable: React.SFC<WrappedComponentProps> = ({ intl }) => {
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
        filterName,
        onFilterChange,
      }) => {
        const sourceType = type === 'AZURE' ? 'Azure' : type;
        return (
          <Stack gutter="md">
            <StackItem>
              <Title size="xl">
                {intl.formatMessage({
                  id: `cost_models_wizard.source.title_${type}`,
                })}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {intl.formatMessage({
                    id: 'cost_models_wizard.source.sub_title',
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h3}>
                  {intl.formatMessage(
                    { id: 'cost_models_wizard.source.caption' },
                    {
                      type: intl.formatMessage({
                        id: `source_details.type.${type}`,
                      }),
                    }
                  )}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <AssignSourcesToolbar
                filter={{
                  onRemove: (category, chip) =>
                    fetchSources(
                      sourceType,
                      removeMultiValueQuery(query)(category, chip),
                      1,
                      perPage
                    ),
                  onClearAll: () => fetchSources(sourceType, {}, 1, perPage),
                  query,
                }}
                searchInputProps={{
                  id: 'assign-source-search-input',
                  value: filterName,
                  onChange: onFilterChange,
                  onSearch: _evt => {
                    fetchSources(
                      sourceType,
                      addMultiValueQuery(query)('name', filterName),
                      1,
                      perPage
                    );
                  },
                }}
                paginationProps={{
                  isCompact: true,
                  itemCount: sources.length,
                  perPage,
                  page,
                  onSetPage: (_evt, newPage) => {
                    fetchSources(sourceType, query, newPage, perPage);
                  },
                  onPerPageSelect: (_evt, newPerPage) =>
                    fetchSources(sourceType, query, 1, newPerPage),
                }}
              />
              {loading ? (
                <LoadingState />
              ) : (
                <Table
                  aria-label={intl.formatMessage({
                    id: 'cost_models_wizard.source_table.table_aria_label',
                  })}
                  cells={[
                    intl.formatMessage({
                      id: 'cost_models_wizard.source_table.column_name',
                    }),
                    intl.formatMessage({
                      id: 'cost_models_wizard.source_table.column_cost_model',
                    }),
                  ]}
                  onSelect={(_evt, isSelected, rowId) =>
                    onSourceSelect(rowId, isSelected)
                  }
                  rows={sources.map(r => {
                    return {
                      cells: [
                        <>
                          {r.name}{' '}
                          {r.selected && Boolean(r.costmodel) && (
                            <WarningIcon
                              key={`wrng-${r.name}`}
                              text={intl.formatMessage(
                                {
                                  id:
                                    'cost_models_wizard.warning_override_source',
                                },
                                { cost_model: r.costmodel }
                              )}
                            />
                          )}
                        </>,
                        Boolean(r.costmodel)
                          ? r.costmodel
                          : intl.formatMessage({
                              id:
                                'cost_models_wizard.source_table.default_cost_model',
                            }),
                      ],
                      selected: r.selected,
                    };
                  })}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
              <DataToolbar id="costmodels_wizard_datatoolbar">
                <DataToolbarContent
                  aria-label={intl.formatMessage({
                    id:
                      'cost_models_wizard.source_table.pagination_section_aria_label',
                  })}
                >
                  <DataToolbarGroup style={{ marginLeft: 'auto' }}>
                    <DataToolbarItem>
                      <Pagination
                        isCompact
                        itemCount={sources.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_evt, newPage) => {
                          fetchSources(sourceType, query, newPage, perPage);
                        }}
                        onPerPageSelect={(_evt, newPerPage) =>
                          fetchSources(sourceType, query, 1, newPerPage)
                        }
                      />
                    </DataToolbarItem>
                  </DataToolbarGroup>
                </DataToolbarContent>
              </DataToolbar>
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default injectIntl(SourcesTable);
