import { Checkbox, Stack, StackItem, Text, TextContent, TextVariants, Title, TitleSizes } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { LoadingState } from 'routes/components/state/loadingState/loadingState';
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
                <Text component={TextVariants.h6}>{intl.formatMessage(messages.costModelsWizardSourceSubtitle)}</Text>
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
                <Table
                  aria-label={intl.formatMessage(messages.costModelsWizardSourceTableAriaLabel)}
                  cells={[
                    '',
                    intl.formatMessage(messages.names, { count: 1 }),
                    intl.formatMessage(messages.costModelsWizardSourceTableCostModel),
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
                            isChecked={checked[r.uuid] && checked[r.uuid].selected}
                            isDisabled={Boolean(r.costmodel)}
                          />
                        </>,
                        <>
                          {r.name}{' '}
                          {Boolean(r.costmodel) && (
                            <WarningIcon
                              key={`wrng-${r.name}`}
                              text={intl.formatMessage(messages.costModelsWizardSourceWarning, {
                                costModel: r.costmodel,
                              })}
                            />
                          )}
                        </>,
                        r.costmodel ? r.costmodel : '',
                      ],
                      selected: checked[r.uuid] && checked[r.uuid].selected,
                    };
                  })}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
              <PaginationToolbarTemplate
                itemCount={itemCount}
                perPage={perPage}
                page={page}
                titles={{paginationTitle: 'sources pagination'}}
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
