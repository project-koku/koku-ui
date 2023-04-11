import { Checkbox, Stack, StackItem, Text, TextContent, TextVariants, Title, TitleSizes } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { LoadingState } from 'routes/components/state/loadingState';
import { addMultiValueQuery, removeMultiValueQuery } from 'routes/costModels/components/filterLogic';
import { PaginationToolbarTemplate } from 'routes/costModels/components/paginationToolbarTemplate';
import { WarningIcon } from 'routes/costModels/components/warningIcon';

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
              <TextContent>
                <Text>{intl.formatMessage(messages.costModelsWizardSourceSubtitle)}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h3}>
                  {intl.formatMessage(messages.costModelsWizardSourceCaption, {
                    value: type.toLowerCase(),
                  })}
                </Text>
              </TextContent>
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
                  onChange: onFilterChange,
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
                <TableComposable aria-label={intl.formatMessage(messages.costModelsWizardSourceTableAriaLabel)}>
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
                            onChange={isChecked => {
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
                          {Boolean(row.costmodel) && (
                            <WarningIcon
                              key={`wrng-${row.name}`}
                              text={intl.formatMessage(messages.costModelsWizardSourceWarning, {
                                costModel: row.costmodel,
                              })}
                            />
                          )}
                        </Td>
                        <Td>{row.costmodel ? row.costmodel : ''}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </TableComposable>
              )}
              <PaginationToolbarTemplate
                itemCount={itemCount}
                perPage={perPage}
                page={page}
                titles={{
                  paginationTitle: intl.formatMessage(messages.paginationTitle, {
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
