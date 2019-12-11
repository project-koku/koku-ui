import {
  Pagination,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import FilterComposition from 'components/filter/filterComposition';
import FilterResults from 'components/filter/filterResults';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import { WarningIcon } from '../createCostModelWizard/warningIcon';

interface AddSourcesStepProps extends InjectedTranslateProps {
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
  setState: (newState: {
    [uuid: string]: { selected: boolean; meta: Provider };
  }) => void;
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
}

class AddSourcesStep extends React.Component<AddSourcesStepProps> {
  public render() {
    const { costModel } = this.props;
    if (this.props.isLoadingSources) {
      return <LoadingState />;
    }
    if (this.props.fetchingSourcesError) {
      return <ErrorState error={null} />;
    }
    const sources = this.props.providers.map(providerData => {
      const isSelected = this.props.checked[providerData.uuid]
        ? this.props.checked[providerData.uuid].selected
        : false;
      const provCostModels =
        providerData.cost_models === undefined
          ? this.props.t('cost_models_wizard.source_table.default_cost_model')
          : providerData.cost_models.map(cm => cm.name).join(',');
      const warningIcon =
        isSelected &&
        providerData.cost_models.length &&
        providerData.cost_models.find(cm => cm.name === costModel.name) ===
          undefined ? (
          <WarningIcon
            key={providerData.uuid}
            text={this.props.t('cost_models_wizard.warning_override_source', {
              cost_model: provCostModels,
            })}
          />
        ) : null;
      const cellName = (
        <div key={providerData.uuid}>
          {providerData.name} {warningIcon}
        </div>
      );
      return {
        cells: [
          cellName,
          provCostModels ||
            this.props.t('cost_models_wizard.source_table.default_cost_model'),
        ],
        selected: isSelected,
      };
    });
    const capatalizedName = this.props.currentFilter.name
      ? this.props.currentFilter.name.charAt(0).toUpperCase() +
        this.props.currentFilter.name.substr(1)
      : 'Name';
    return (
      <>
        <Toolbar>
          <ToolbarSection
            aria-label={this.props.t(
              'cost_models_details.sources_filter_controller'
            )}
            style={{ justifyContent: 'space-between' }}
          >
            <FilterComposition
              isSingleOption
              id="add_source_step_filter"
              options={[
                { value: 'OCP', label: this.props.t('filter.type_ocp') },
                { value: 'AWS', label: this.props.t('filter.type_aws') },
              ]}
              filters={['name']}
              query={{ Name: this.props.query.name }}
              value={this.props.currentFilter.value}
              name={capatalizedName}
              updateFilter={x =>
                this.props.updateFilter({
                  currentFilterType: x.name,
                  currentFilterValue: x.value,
                })
              }
              switchType={x =>
                this.props.updateFilter({
                  currentFilterType: x.name,
                  currentFilterValue: x.value,
                })
              }
              onSearch={n => {
                this.props.fetch(
                  `name=${n.Name}&limit=${
                    this.props.pagination.perPage
                  }&offset=1`
                );
              }}
            />
            <ToolbarGroup>
              <ToolbarItem>
                <Pagination
                  itemCount={this.props.pagination.count}
                  isDisabled={this.props.isLoadingSources}
                  perPage={this.props.pagination.perPage}
                  page={this.props.pagination.page}
                  onPerPageSelect={(_evt, newPerPage) => {
                    this.props.fetch(
                      `limit=${newPerPage}&offset=0&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                  onSetPage={(_evt, newPage) => {
                    this.props.fetch(
                      `limit=${this.props.pagination.perPage}&offset=${this
                        .props.pagination.perPage *
                        (newPage - 1)}&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
          <ToolbarSection
            aria-label={this.props.t(
              'cost_models_details.sources_filter_results'
            )}
          >
            <FilterResults
              query={{ Name: this.props.query.name }}
              count={this.props.pagination.count}
              onRemoveAll={() => {
                this.props.fetch(
                  `limit=${this.props.pagination.perPage}&offset=0`
                );
              }}
              onRemove={({ value }) => {
                const curQuery = this.props.query.name;
                if (curQuery === undefined) {
                  return;
                }
                const newQuery = curQuery
                  .split(',')
                  .filter(q => q !== value)
                  .join(',');
                if (newQuery !== '') {
                  this.props.fetch(
                    `name=${newQuery}&limit=${
                      this.props.pagination.perPage
                    }&offset=0`
                  );
                } else {
                  this.props.fetch(
                    `limit=${this.props.pagination.perPage}&offset=0`
                  );
                }
              }}
            />
          </ToolbarSection>
        </Toolbar>
        {sources.length > 0 && (
          <Table
            aria-label={this.props.t('cost_models_details.add_source')}
            onSelect={(_evt, isSelected, rowId) => {
              if (rowId === -1) {
                const newState = this.props.providers.reduce((acc, cur) => {
                  return {
                    ...acc,
                    [cur.uuid]: { selected: isSelected, meta: cur },
                  };
                }, {});
                this.props.setState(newState as {
                  [uuid: string]: { selected: boolean; meta: Provider };
                });
                return;
              }
              this.props.setState({
                ...this.props.checked,
                [this.props.providers[rowId].uuid]: {
                  selected: isSelected,
                  meta: this.props.providers[rowId],
                },
              });
            }}
            cells={[
              this.props.t('filter.name'),
              this.props.t('cost_models_wizard.source_table.column_cost_model'),
            ]}
            rows={sources}
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {sources.length === 0 && (
          <EmptyFilterState
            subTitle={this.props.t('no_match_found_state.desc')}
          />
        )}
        <Toolbar>
          <ToolbarSection
            style={{ flexDirection: 'row-reverse' }}
            aria-label={this.props.t(
              'cost_models_details.sources_pagination_bottom'
            )}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <Pagination
                  itemCount={this.props.pagination.count}
                  isDisabled={this.props.isLoadingSources}
                  perPage={this.props.pagination.perPage}
                  page={this.props.pagination.page}
                  onPerPageSelect={(_evt, newPerPage) => {
                    this.props.fetch(
                      `limit=${newPerPage}&offset=0&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                  onSetPage={(_evt, newPage) => {
                    this.props.fetch(
                      `limit=${this.props.pagination.perPage}&offset=${this
                        .props.pagination.perPage *
                        (newPage - 1)}&${
                        this.props.query.name
                          ? `name=${this.props.query.name}`
                          : ''
                      }`
                    );
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
        </Toolbar>
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => {
    return {
      currentFilter: {
        name: sourcesSelectors.currentFilterType(state),
        value: sourcesSelectors.currentFilterValue(state),
      },
    };
  }),
  {
    updateFilter: sourcesActions.updateFilterToolbar,
  }
)(translate()(AddSourcesStep));
