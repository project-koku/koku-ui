import { Checkbox, Content, ContentVariants, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { LoadingState } from 'routes/components/state/loadingState';
import { addMultiValueQuery, removeMultiValueQuery } from 'routes/settings/costModels/components/filterLogic';
import { PaginationToolbarTemplate } from 'routes/settings/costModels/components/paginationToolbarTemplate';
import { WarningIcon } from 'routes/settings/costModels/components/warningIcon';

import { AssignSourcesToolbar } from './assignSourcesToolbar';
import { CostModelContext } from './context';

const SourcesTable: React.FC<WrappedComponentProps> = ({ intl }) => {
  return (
    <CostModelContext.Consumer>
      {({
        checked,
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
        const sourceType = type === 'Azure' ? 'Azure' : type;
        const itemCount = sources.length > 0 ? sources[0].meta.count : 0;
        return (
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl}>
                {intl.formatMessage(messages.costModelsWizardSourceTitle)}
              </Title>
            </StackItem>
            <StackItem>
              <Content>
                <Content component="p">{intl.formatMessage(messages.costModelsWizardSourceSubtitle)}</Content>
              </Content>
            </StackItem>
            <StackItem>
              <Content>
                <Content component={ContentVariants.h3}>
                  {intl.formatMessage(messages.costModelsWizardSourceCaption, {
                    value: type.toLowerCase(),
                  })}
                </Content>
              </Content>
            </StackItem>
            <StackItem>
              <AssignSourcesToolbar
                filter={{
                  onRemove: (category, chip) =>
                    fetchSources(sourceType, removeMultiValueQuery(query)(category, chip), 1, perPage),
                  onClearAll: () => fetchSources(sourceType, {}, 1, perPage),
                  query,
                }}
                filterInputProps={{
                  id: 'assign-source-search-input',
                  value: filterName,
                  onChange: (value: string) => onFilterChange(value),
                  onSearch: () => {
                    fetchSources(sourceType, addMultiValueQuery(query)('name', filterName), 1, perPage);
                  },
                }}
                paginationProps={{
                  isCompact: true,
                  itemCount,
                  perPage,
                  page,
                  onSetPage: (_evt, newPage) => {
                    fetchSources(sourceType, query, newPage, perPage);
                  },
                  onPerPageSelect: (_evt, newPerPage) => fetchSources(sourceType, query, 1, newPerPage),
                }}
              />
              {loading ? (
                <LoadingState />
              ) : (
                <Table
                  aria-label={intl.formatMessage(messages.costModelsWizardSourceTableAriaLabel)}
                  variant={TableVariant.compact}
                >
                  <Thead>
                    <Tr>
                      {[
                        '',
                        intl.formatMessage(messages.names, { count: 1 }),
                        intl.formatMessage(messages.costModelsWizardSourceTableCostModel),
                      ].map((c, i) => (
                        <Th key={i}>{c}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sources.map((row, rowIndex) => (
                      <Tr key={rowIndex}>
                        <Td>
                          <Checkbox
                            onChange={(_evt, isChecked) => {
                              onSourceSelect(rowIndex, isChecked);
                            }}
                            id={row.name}
                            key={row.name}
                            aria-label={intl.formatMessage(messages.selectRow, { value: rowIndex })}
                            isChecked={checked[row.uuid] && checked[row.uuid].selected}
                            isDisabled={Boolean(row.costmodel)}
                          />
                        </Td>
                        <Td>
                          {row.name}{' '}
                          {row.costmodel && (
                            <WarningIcon
                              key={`wrng-${row.name}`}
                              text={
                                intl.formatMessage(messages.costModelsWizardSourceWarning, {
                                  costModel: row.costmodel,
                                }) as string
                              }
                            />
                          )}
                        </Td>
                        <Td>{row.costmodel ? row.costmodel : ''}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
              <PaginationToolbarTemplate
                itemCount={itemCount}
                perPage={perPage}
                page={page}
                titles={{
                  paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                    title: intl.formatMessage(messages.sources),
                    placement: 'bottom',
                  }),
                }}
                onSetPage={(_evt, newPage) => {
                  fetchSources(sourceType, query, newPage, perPage);
                }}
                onPerPageSelect={(_evt, newPerPage) => fetchSources(sourceType, query, 1, newPerPage)}
              />
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default injectIntl(SourcesTable);
