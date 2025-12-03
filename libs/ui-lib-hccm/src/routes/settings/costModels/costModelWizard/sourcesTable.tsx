import messages from '@koku-ui/i18n/locales/messages';
import {
  Checkbox,
  Content,
  ContentVariants,
  Stack,
  StackItem,
  Title,
  TitleSizes,
  Tooltip,
  Truncate,
} from '@patternfly/react-core';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { LoadingState } from '../../../components/state/loadingState';
import { getOperatorStatus } from '../../../utils/operatorStatus';
import { addMultiValueQuery, removeMultiValueQuery } from '../components/filterLogic';
import { PaginationToolbarTemplate } from '../components/paginationToolbarTemplate';
import { AssignSourcesToolbar } from './assignSourcesToolbar';
import { CostModelContext } from './context';
import { styles } from './wizard.styles';

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
                      <Th />
                      <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
                      {sourceType === 'OCP' && <Th>{intl.formatMessage(messages.operatorVersion)}</Th>}
                      <Th style={sourceType === 'OCP' ? styles.costModelAssigned : undefined}>
                        {intl.formatMessage(messages.costModelsWizardSourceTableCostModel)}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sources.map((row, rowIndex) => (
                      <Tr key={rowIndex}>
                        <Td>
                          {row.costmodel ? (
                            <Tooltip
                              content={intl.formatMessage(messages.costModelsWizardSourceWarning, {
                                costModel: row.costmodel,
                              })}
                            >
                              <Checkbox
                                id={row.name}
                                key={row.name}
                                aria-label={intl.formatMessage(messages.selectRow, { value: rowIndex })}
                                isDisabled
                              />
                            </Tooltip>
                          ) : (
                            <Checkbox
                              onChange={(_evt, isChecked) => {
                                onSourceSelect(rowIndex, isChecked);
                              }}
                              id={row.name}
                              key={row.name}
                              aria-label={intl.formatMessage(messages.selectRow, { value: rowIndex })}
                              isChecked={checked[row.uuid] && checked[row.uuid].selected}
                            />
                          )}
                        </Td>
                        <Td>
                          <Truncate maxCharsDisplayed={35} content={row.name} />
                        </Td>
                        {sourceType === 'OCP' && <Td>{getOperatorStatus(row.updateAvailable)}</Td>}
                        <Td>
                          <Truncate maxCharsDisplayed={35} content={row.costmodel ? row.costmodel : ''} />
                        </Td>
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
