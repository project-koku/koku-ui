import { Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import messages from 'locales/messages';
import { SourcesModalErrorState } from 'pages/costModels/components/errorState';
import { addMultiValueQuery, removeMultiValueQuery } from 'pages/costModels/components/filterLogic';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
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
          const selected = this.props.checked[cur.uuid] ? this.props.checked[cur.uuid].selected : false;
          const disabled = cur.cost_models.length > 0;
          return {
            ...acc,
            [cur.uuid]: { selected: disabled ? selected : isSelected, meta: cur, disabled },
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
          ? intl.formatMessage(messages.CostModelsWizardSourceTableDefaultCostModel)
          : providerData.cost_models.map(cm => cm.name).join(',');
      const warningIcon =
        providerData.cost_models.length &&
        providerData.cost_models.find(cm => cm.name === costModel.name) === undefined ? (
          <WarningIcon
            key={providerData.uuid}
            text={intl.formatMessage(messages.CostModelsWizardSourceWarning, { costModel: provCostModels })}
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
        disableSelection: providerData.cost_models.length > 0,
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
            id: 'assign-sources-modal-toolbar',
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
          <Table
            aria-label={intl.formatMessage(messages.CostModelsAssignSources, { count: 1 })}
            cells={[
              intl.formatMessage(messages.Names, { count: 1 }),
              intl.formatMessage(messages.CostModelsWizardSourceTableCostModel),
            ]}
            rows={sources}
            onSelect={onSelect}
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {sources.length === 0 && (
          <EmptyFilterState filter={this.props.filter} subTitle={messages.EmptyFilterSourceStateSubtitle} />
        )}
        <Toolbar id="costmodels_details.sources_pagination_datatoolbar">
          <ToolbarContent style={{ flexDirection: 'row-reverse' }}>
            <ToolbarItem variant="pagination">
              <Pagination
                itemCount={this.props.pagination.count}
                isDisabled={this.props.isLoadingSources}
                perPage={this.props.pagination.perPage}
                page={this.props.pagination.page}
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
