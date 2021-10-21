import { Checkbox, Stack, StackItem, Text, TextContent, TextVariants, Title, TitleSizes } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { LoadingState } from 'components/state/loadingState/loadingState';
import messages from 'locales/messages';
import { addMultiValueQuery, removeMultiValueQuery } from 'pages/costModels/components/filterLogic';
import { PaginationToolbarTemplate } from 'pages/costModels/components/paginationToolbarTemplate';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { AssignSourcesToolbar } from './assignSourcesToolbar';
import { CostModelContext } from './context';

const SourcesTable: React.SFC<WrappedComponentProps> = ({ intl }) => {
  return (
    <CostModelContext.Consumer>
      {({ loading, onSourceSelect, sources, perPage, page, type, query, fetchSources, filterName, onFilterChange }) => {
        const sourceType = type === 'Azure' ? 'Azure' : type;
        return (
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl}>
                {intl.formatMessage(messages.CostModelsWizardSourceTitle)}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{intl.formatMessage(messages.CostModelsWizardSourceSubtitle)}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h3}>
                  {intl.formatMessage(messages.CostModelsWizardSourceCaption, {
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
                  itemCount: sources.length,
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
                  aria-label={intl.formatMessage(messages.CostModelsWizardSourceTableAriaLabel)}
                  cells={[
                    '',
                    intl.formatMessage(messages.Names, { count: 1 }),
                    intl.formatMessage(messages.CostModelsWizardSourceTableCostModel),
                  ]}
                  rows={sources.map((r, ix) => {
                    return {
                      cells: [
                        <>
                          <Checkbox
                            onChange={isChecked => {
                              onSourceSelect(ix, isChecked);
                            }}
                            id={r.name}
                            key={r.name}
                            isChecked={r.selected}
                            isDisabled={Boolean(r.costmodel)}
                          />
                        </>,
                        <>
                          {r.name}{' '}
                          {Boolean(r.costmodel) && (
                            <WarningIcon
                              key={`wrng-${r.name}`}
                              text={intl.formatMessage(messages.CostModelsWizardSourceWarning, {
                                costModel: r.costmodel,
                              })}
                            />
                          )}
                        </>,
                        r.costmodel ? r.costmodel : '',
                      ],
                      selected: r.selected,
                    };
                  })}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
              <PaginationToolbarTemplate
                itemCount={sources.length}
                perPage={perPage}
                page={page}
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
