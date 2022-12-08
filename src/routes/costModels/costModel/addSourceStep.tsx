import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { CostModel } from 'api/costModels';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { LoadingState } from 'routes/components/state/loadingState';
import { SourcesModalErrorState } from 'routes/costModels/components/errorState';
import { addMultiValueQuery, removeMultiValueQuery } from 'routes/costModels/components/filterLogic';
import { WarningIcon } from 'routes/costModels/components/warningIcon';
import { createMapStateToProps } from 'store/common';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';

import { AssignSourcesToolbar } from './assignSourcesModalToolbar';

interface AddSourcesStepProps extends WrappedComponentProps {
  providers: Provider[];
  isLoadingSources: boolean;
  fetchingSourcesError: string;
  query: { name: string; type: string; offset: string; limit: string };
  pagination: { page: number; perPage: number; count: number };
  updateFilter: typeof sourcesActions.updateFilterToolbar;
  currentFilter: {
    name: string;
    value: string;
  };
  filter: string;
  setState: (newState: { [uuid: string]: { selected: boolean; meta: Provider } }) => void;
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
}

class AddSourcesStep extends React.Component<AddSourcesStepProps> {
  public render() {
    const { costModel, intl } = this.props;

    if (this.props.isLoadingSources) {
      return <LoadingState />;
    }
    if (this.props.fetchingSourcesError) {
      return <SourcesModalErrorState />;
    }

    const onSelect = (_evt, isSelected, rowId) => {
      if (rowId === -1) {
        const pageSelections = this.props.providers.reduce((acc, cur) => {
          // If assigned to another cost model, maintain original selection
          const isAssigned =
            cur.cost_models.length && cur.cost_models.find(cm => cm.name === costModel.name) === undefined;
          const selected = this.props.checked[cur.uuid] ? this.props.checked[cur.uuid].selected : false;
          return {
            ...acc,
            [cur.uuid]: { selected: isAssigned ? selected : isSelected, meta: cur, isAssigned },
          };
        }, {});
        const newState = {
          ...this.props.checked,
          ...pageSelections,
        };
        this.props.setState(
          newState as {
            [uuid: string]: { selected: boolean; meta: Provider };
          }
        );
        return;
      }
      this.props.setState({
        ...this.props.checked,
        [this.props.providers[rowId].uuid]: {
          selected: isSelected,
          meta: this.props.providers[rowId],
        },
      });
    };

    const sources = this.props.providers.map(providerData => {
      const isSelected = this.props.checked[providerData.uuid] ? this.props.checked[providerData.uuid].selected : false;
      const provCostModels =
        providerData.cost_models === undefined
          ? intl.formatMessage(messages.costModelsWizardSourceTableDefaultCostModel)
          : providerData.cost_models.map(cm => cm.name).join(',');
      const isAssigned =
        providerData.cost_models.length &&
        providerData.cost_models.find(cm => cm.name === costModel.name) === undefined;
      // If assigned to another cost model, show warning
      const warningIcon = isAssigned ? (
        <WarningIcon
          key={providerData.uuid}
          text={intl.formatMessage(messages.costModelsWizardSourceWarning, { costModel: provCostModels })}
        />
      ) : null;
      const cellName = (
        <div key={providerData.uuid}>
          {providerData.name} {warningIcon}
        </div>
      );
      return {
        cells: [cellName, provCostModels || ''],
        selected: isSelected,
        disableSelection: isAssigned,
      };
    });

    const sourceTypeMap = {
      'OpenShift Container Platform': 'OCP',
      'Microsoft Azure': 'Azure',
      'Amazon Web Services': 'AWS',
    };

    const source_type = sourceTypeMap[costModel.source_type];
    return (
      <>
        <AssignSourcesToolbar
          filter={{
            onClearAll: () => this.props.fetch(`source_type=${source_type}&limit=${this.props.pagination.perPage}`),
            onRemove: (category, chip) => {
              const newQuery = removeMultiValueQuery({
                name: this.props.query.name ? this.props.query.name.split(',') : [],
              })(category, chip);
              this.props.fetch(
                `source_type=${source_type}${newQuery.name ? `&name=${newQuery.name.join(',')}` : ''}&offset=0&limit=${
                  this.props.pagination.perPage
                }`
              );
            },
            query: {
              name: this.props.query.name ? this.props.query.name.split(',') : [],
            },
          }}
          filterInputProps={{
            id: 'assign-sources-modal-toolbar-input',
            onChange: value =>
              this.props.updateFilter({
                currentFilterType: 'name',
                currentFilterValue: value,
              }),
            value: this.props.currentFilter.value,
            onSearch: () => {
              const curQuery = this.props.query.name ? this.props.query.name.split(',') : [];
              const newQuery = addMultiValueQuery({ name: curQuery })('name', this.props.currentFilter.value);
              this.props.fetch(
                `source_type=${source_type}&name=${newQuery.name.join(',')}&limit=${
                  this.props.pagination.perPage
                }&offset=0`
              );
            },
          }}
          paginationProps={{
            isCompact: true,
            itemCount: this.props.pagination.count,
            perPage: this.props.pagination.perPage,
            page: this.props.pagination.page,
            onPerPageSelect: (_evt, newPerPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${newPerPage}&offset=0&${
                  this.props.query.name ? `name=${this.props.query.name}` : ''
                }`
              );
            },
            onSetPage: (_evt, newPage) => {
              this.props.fetch(
                `source_type=${source_type}&limit=${this.props.pagination.perPage}&offset=${
                  this.props.pagination.perPage * (newPage - 1)
                }&${this.props.query.name ? `name=${this.props.query.name}` : ''}`
              );
            },
          }}
        />
        {sources.length > 0 && (
          <TableComposable aria-label={intl.formatMessage(messages.costModelsAssignSources, { count: 1 })}>
            <Thead>
              <Tr>
                <Th
                  select={{
                    onSelect: (_evt, isSelecting) => onSelect(_evt, isSelecting, -1),
                    isSelected: sources.filter(s => s.disableSelection || s.selected).length === sources.length,
                  }}
                ></Th>
                <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
                <Th>{intl.formatMessage(messages.costModelsWizardSourceTableCostModel)}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sources.map((s, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td
                    select={{
                      disable: s.disableSelection,
                      onSelect: _evt => onSelect(_evt, !s.selected, rowIndex),
                      isSelected: s.selected,
                      rowIndex,
                    }}
                  ></Td>
                  {s.cells.map((c, cellIndex) => (
                    <Td key={cellIndex}>{c}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        )}
        {sources.length === 0 && (
          <EmptyFilterState filter={this.props.filter} subTitle={messages.emptyFilterSourceStateSubtitle} />
        )}
        <Toolbar id="costmodels_details.sources_pagination_datatoolbar">
          <ToolbarContent style={{ flexDirection: 'row-reverse' }}>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={this.props.pagination.count}
                isDisabled={this.props.isLoadingSources}
                perPage={this.props.pagination.perPage}
                page={this.props.pagination.page}
                titles={{
                  paginationTitle: intl.formatMessage(messages.paginationTitle, {
                    title: intl.formatMessage(messages.costModelsAssignSourcesParen),
                    placement: 'bottom',
                  }),
                }}
                onPerPageSelect={(_evt, newPerPage) => {
                  this.props.fetch(
                    `limit=${newPerPage}&offset=0&${this.props.query.name ? `name=${this.props.query.name}` : ''}`
                  );
                }}
                onSetPage={(_evt, newPage) => {
                  this.props.fetch(
                    `limit=${this.props.pagination.perPage}&offset=${this.props.pagination.perPage * (newPage - 1)}&${
                      this.props.query.name ? `name=${this.props.query.name}` : ''
                    }`
                  );
                }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        currentFilter: {
          name: sourcesSelectors.currentFilterType(state),
          value: sourcesSelectors.currentFilterValue(state),
        },
        filter: sourcesSelectors.filter(state),
      };
    }),
    {
      updateFilter: sourcesActions.updateFilterToolbar,
    }
  )(AddSourcesStep)
);
