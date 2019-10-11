import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import FilterComposition from 'components/filter/filterComposition';
import FilterResults from 'components/filter/filterResults';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

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

interface State {
  query: { [k: string]: string };
  currentFilter: CurrentFilter;
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
  };
  public render() {
    const { onAdd, t, rows, cells } = this.props;
    const changeBuffer = setCurrentFilter(
      this.state.currentFilter,
      this.setState.bind(this)
    );
    const changeType = switchFilterType(this.state.currentFilter.name)(
      changeBuffer
    );
    const res = rows
      .filter(uuid => {
        const filters = this.state.query.Name.split(',');
        return filters.every(fName => uuid.includes(fName));
      })
      .map(uuid => [uuid]);
    return (
      <>
        <Toolbar>
          <ToolbarSection
            aria-label={t('cost_models_details.sources_filter_controller')}
          >
            <FilterComposition
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
                });
              }}
            />
            {onAdd && (
              <ToolbarGroup>
                <ToolbarItem>
                  <Button onClick={onAdd.onClick}>{onAdd.label}</Button>
                </ToolbarItem>
              </ToolbarGroup>
            )}
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
        {res.length === 0 && (
          <EmptyFilterState
            filter={this.state.currentFilter.name}
            subTitle={t('no_match_found_state.desc')}
          />
        )}
      </>
    );
  }
}

export default translate()(TableBase);
