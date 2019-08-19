import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { relativeTime } from 'human-date';
import { CostModelWizard } from 'pages/createCostModelWizard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';
import CostModelInformation from './costModelInfo';
import { styles } from './costModelsDetails.styles';
import CostModelsPagination from './costModelsPagination';
import CostModelsTable from './costModelsTable';
import EmptyState from './emptyState';
import FilterResults from './filterResults';
import FilterToolbar from './filterToolbar';
import Header from './header';

interface Props extends InjectedTranslateProps {
  costModels: CostModel[];
  error: AxiosError;
  status: FetchStatus;
  updateFilter: typeof costModelsActions.updateFilterToolbar;
  fetch: typeof costModelsActions.fetchCostModels;
  setCurrentCostModel: typeof costModelsActions.selectCostModel;
  resetCurrentCostModel: typeof costModelsActions.resetCostModel;
  pagination: any;
  query: any;
  currentFilterType: string;
  currentFilterValue: string;
  currentCostModel: CostModel;
}

interface State {
  isWizardOpen: boolean;
  uuid: string;
}

class CostModelsDetails extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { isWizardOpen: false, uuid: '' };
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
  }

  public componentDidMount() {
    this.props.fetch();
  }

  public onRemove(name: string, value: string) {
    const filters = this.props.query[name];
    if (!filters) {
      return;
    }
    const filtersArray = filters.split(',');
    const index = filtersArray.indexOf(value);
    if (index < -1) {
      return;
    }
    const newFiltersArray = [
      ...filtersArray.slice(0, index),
      ...filtersArray.slice(index + 1),
    ].join(',');
    this.updateResults({
      ...this.props.query,
      [name]: newFiltersArray,
    });
  }

  public onUpdateFilter(selected: string) {
    let key = null;
    if (selected === 'type') {
      key = 'currentFilterType';
    }
    if (selected === 'value') {
      key = 'currentFilterValue';
    }
    return (value: string) => {
      if (key === null) {
        return;
      }
      this.props.updateFilter({ [key]: value });
    };
  }

  private updateResults(newQuery) {
    const res = Object.keys(newQuery)
      .filter(k => newQuery[k])
      .reduce((acc, curr) => {
        const currQuery = `${curr}=${newQuery[curr]}`;
        return acc === null ? currQuery : `${acc}&${currQuery}`;
      }, null);
    this.props.fetch(res);
  }

  public onPaginationChange(searchQuery) {
    const newQuery = { ...this.props.query, ...searchQuery };
    this.updateResults(newQuery);
  }

  public onFilterChange(searchQuery) {
    let newQuery = { ...this.props.query, ...searchQuery };
    if (searchQuery.name) {
      let nameParam = searchQuery.name.replace(/,/g, '');
      if (this.props.query.name) {
        nameParam = [
          ...this.props.query.name.split(','),
          searchQuery.name.replace(/,/g, ''),
        ].join(',');
      }
      newQuery = {
        ...this.props.query,
        name: nameParam,
      };
    }
    this.updateResults(newQuery);
  }

  public resetFilter() {
    this.updateResults({ ...this.props.query, name: null, type: null });
  }

  public render() {
    const {
      resetCurrentCostModel,
      setCurrentCostModel,
      currentCostModel,
      costModels,
      pagination,
      status,
      error,
      t,
    } = this.props;
    const columns = [
      t('cost_models_details.table.columns.name'),
      t('cost_models_details.table.columns.desc'),
      t('cost_models_details.table.columns.sources'),
      t('cost_models_details.table.columns.last_modified'),
      '',
    ];
    const rows = costModels.map(cm => [
      cm.uuid,
      cm.name,
      cm.description,
      cm.providers.length,
      relativeTime(cm.updated_timestamp),
    ]);
    const filterValue = Object.keys(this.props.query)
      .filter(k => ['name', 'type'].includes(k))
      .find(k => this.props.query[k]);

    return currentCostModel === null ? (
      <>
        {this.state.isWizardOpen && (
          <CostModelWizard
            isOpen={this.state.isWizardOpen}
            closeWizard={() => this.setState({ isWizardOpen: false })}
          />
        )}
        <div className={css(styles.sourceSettings)}>
          <Header t={t} />
          <div className={css(styles.content)}>
            {status !== FetchStatus.none &&
              error === null &&
              (rows.length > 0 || filterValue) && (
                <div className={css(styles.toolbarContainer)}>
                  <Toolbar>
                    <ToolbarSection
                      aria-label={t('source_details.filter.section_below')}
                    >
                      <FilterToolbar
                        onSearch={this.onFilterChange}
                        options={{
                          name: t('cost_models_details.table.columns.name'),
                        }}
                        value={this.props.currentFilterValue}
                        selected={this.props.currentFilterType}
                        onChange={this.onUpdateFilter}
                      />
                      <ToolbarGroup>
                        <ToolbarItem>
                          <Button
                            variant="primary"
                            onClick={() =>
                              this.setState({ isWizardOpen: true })
                            }
                          >
                            {t('cost_models_details.filter.create_button')}
                          </Button>
                        </ToolbarItem>
                      </ToolbarGroup>
                      <ToolbarGroup style={{ marginLeft: 'auto' }}>
                        <ToolbarItem>
                          <CostModelsPagination
                            status={status}
                            fetch={this.onPaginationChange}
                            pagination={pagination}
                          />
                        </ToolbarItem>
                      </ToolbarGroup>
                    </ToolbarSection>
                    <ToolbarSection
                      aria-label={t('source_details.filter.section_below')}
                    >
                      <FilterResults
                        count={pagination.count}
                        filterQuery={this.props.query}
                        onRemove={this.onRemove}
                        onRemoveAll={this.resetFilter}
                      />
                    </ToolbarSection>
                  </Toolbar>
                </div>
              )}
            {status !== FetchStatus.complete && <LoadingState />}
            {status === FetchStatus.complete && Boolean(error) && (
              <ErrorState error={error} />
            )}
            {status === FetchStatus.complete &&
              !Boolean(error) &&
              rows.length > 0 && (
                <React.Fragment>
                  <CostModelsTable
                    columns={columns}
                    rows={rows}
                    setUuid={uuid =>
                      setCurrentCostModel(
                        costModels.find(cm => cm.uuid === uuid)
                      )
                    }
                  />
                  <div className={css(styles.paginationContainer)}>
                    <CostModelsPagination
                      status={status}
                      fetch={this.onPaginationChange}
                      pagination={pagination}
                    />
                  </div>
                </React.Fragment>
              )}
            {status === FetchStatus.complete &&
              filterValue === undefined &&
              rows.length === 0 && (
                <EmptyState
                  openModal={() => this.setState({ isWizardOpen: true })}
                />
              )}
            {status === FetchStatus.complete &&
              filterValue &&
              rows.length === 0 && (
                <EmptyFilterState
                  filter={this.props.query.name}
                  subTitle={t('no_match_found_state.desc')}
                />
              )}
          </div>
        </div>
      </>
    ) : (
      <CostModelInformation
        name={currentCostModel.name}
        description={currentCostModel.description}
        type={currentCostModel.source_type}
        markup={currentCostModel.markup}
        providers={currentCostModel.providers}
        rates={currentCostModel.rates}
        goBack={() => resetCurrentCostModel()}
        current={currentCostModel}
      />
    );
  }
}

export default translate()(CostModelsDetails);
