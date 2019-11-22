import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Pagination,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import FilterComposition from 'components/filter/filterComposition';
import FilterResults from 'components/filter/filterResults';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { css } from 'emotion';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './table.styles';

interface Props extends InjectedTranslateProps {
  rows: string[];
  cells: string[];
  onDelete: (item: object) => void;
  onDeleteText?: string;
  onAdd: {
    onClick: () => void;
    label: string;
  };
}

interface CurrentFilter {
  name: string;
  value: string;
}

interface PaginationQuery {
  page: number;
  perPage: number;
}

interface State {
  query: { [k: string]: string };
  currentFilter: CurrentFilter;
  pagination: PaginationQuery;
}

const switchFilterType = (name: string) => {
  return (nextFnc: (filter: CurrentFilter) => void) => {
    return (currentFilter: CurrentFilter) => {
      if (name === currentFilter.name) {
        return;
      }
      nextFnc(currentFilter);
    };
  };
};

const setCurrentFilter = (
  currentState: CurrentFilter,
  setState: (obj: any) => void
) => {
  return (currentFilter: CurrentFilter) => {
    setState({ currentFilter });
  };
};

class TableBase extends React.Component<Props, State> {
  public state = {
    query: { Name: '' },
    currentFilter: { name: 'Name', value: '' },
    pagination: { page: 1, perPage: 10 },
  };
  public render() {
    const {
      pagination: { page, perPage },
    } = this.state;
    const { onAdd, t, rows, cells } = this.props;
    const changeBuffer = setCurrentFilter(
      this.state.currentFilter,
      this.setState.bind(this)
    );
    const changeType = switchFilterType(this.state.currentFilter.name)(
      changeBuffer
    );
    const filteredRows = rows
      .filter(uuid => {
        const filters = this.state.query.Name.split(',');
        return filters.every(fName => uuid.includes(fName));
      })
      .map(uuid => [uuid]);
    const res = filteredRows.slice((page - 1) * perPage, page * perPage);
    return (
      <>
        <Toolbar>
          <ToolbarSection
            aria-label={t('cost_models_details.sources_filter_controller')}
            style={{ justifyContent: 'space-between' }}
          >
            <ToolbarGroup>
              <FilterComposition
                isSingleOption
                id={'costmodel-sources-table-filter'}
                options={[
                  { value: 'OCP', label: t('filter.type_ocp') },
                  { value: 'AWS', label: t('filter.type_aws') },
                ]}
                query={this.state.query}
                value={this.state.currentFilter.value}
                name={this.state.currentFilter.name}
                filters={['name']}
                updateFilter={changeBuffer}
                switchType={changeType}
                onSearch={q => {
                  this.setState({
                    query: q,
                    currentFilter: { ...this.state.currentFilter, value: '' },
                    pagination: { ...this.state.pagination, page: 1 },
                  });
                }}
              />
              {onAdd && (
                <ToolbarItem>
                  <Button onClick={onAdd.onClick}>{onAdd.label}</Button>
                </ToolbarItem>
              )}
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Pagination
                  itemCount={filteredRows.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_evt, newPage) =>
                    this.setState({
                      pagination: {
                        ...this.state.pagination,
                        page: newPage,
                      },
                    })
                  }
                  onPerPageSelect={(_evt, newPerPage) =>
                    this.setState({
                      pagination: { page: 1, perPage: newPerPage },
                    })
                  }
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
          <ToolbarSection
            aria-label={t('cost_models_details.sources_filter_results')}
          >
            <FilterResults
              query={this.state.query}
              count={res.length}
              onRemoveAll={() => {
                this.setState({ query: { Name: '' } });
              }}
              onRemove={({ name, value }) => {
                const curQuery = this.state.query[name];
                if (curQuery === undefined) {
                  return;
                }
                const newQuery = curQuery.split(',').filter(q => q !== value);
                this.setState({
                  query: { ...this.state.query, [name]: newQuery.join(',') },
                });
              }}
            />
          </ToolbarSection>
        </Toolbar>
        {res.length > 0 && (
          <Table
            aria-label="cost-model-sources"
            cells={cells}
            rows={res}
            actionResolver={() => [
              this.props.onDelete && {
                title:
                  this.props.onDeleteText ||
                  t('cost_models_details.action_delete'),
                onClick: (_evt, rowId) => {
                  this.props.onDelete(res[rowId]);
                },
              },
            ]}
          >
            <TableHeader />
            <TableBody />
          </Table>
        )}
        {rows.length === 0 && (
          <div className={css(styles.emptyState)}>
            <EmptyState>
              <EmptyStateIcon icon={DollarSignIcon} />
              <Title size="lg">
                {t('cost_models_details.empty_state_source.title')}
              </Title>
              <EmptyStateBody>
                {t('cost_models_details.empty_state_source.description')}
              </EmptyStateBody>
            </EmptyState>
          </div>
        )}
        {filteredRows.length === 0 && rows.length > 0 && (
          <EmptyFilterState
            filter={this.state.currentFilter.name}
            subTitle={t('no_match_found_state.desc')}
          />
        )}
        <Toolbar>
          <ToolbarSection
            aria-label={t('cost_models_details.sources_filter_controller')}
            style={{ flexDirection: 'row-reverse' }}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <Pagination
                  itemCount={filteredRows.length}
                  perPage={perPage}
                  page={page}
                  onSetPage={(_evt, newPage) =>
                    this.setState({
                      pagination: {
                        ...this.state.pagination,
                        page: newPage,
                      },
                    })
                  }
                  onPerPageSelect={(_evt, newPerPage) =>
                    this.setState({
                      pagination: { page: 1, perPage: newPerPage },
                    })
                  }
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
        </Toolbar>
      </>
    );
  }
}

export default translate()(TableBase);
