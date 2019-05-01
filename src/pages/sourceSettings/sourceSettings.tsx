import {
  Button,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Provider } from 'api/providers';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { onboardingActions } from 'store/onboarding';
import { deleteDialogActions } from 'store/sourceDeleteDialog';
import { sourcesActions } from 'store/sourceSettings';
import FilterToolbar from './filterToolbar';
import Header from './header';
import { NoMatchFoundState } from './noMatchFoundState';
import NoSourcesState from './noSourcesState';
import RowCell from './rowCell';
import SourcePagination from './sourcePagination';
import { styles } from './sourceSettings.styles';
import SourceTable from './sourceTable';

interface Props extends InjectedTranslateProps {
  sources: Provider[];
  error: AxiosError;
  status: FetchStatus;
  updateFilter: typeof sourcesActions.updateFilterToolbar;
  fetch: typeof sourcesActions.fetchSources;
  remove: typeof sourcesActions.removeSource;
  showDeleteDialog: typeof deleteDialogActions.openModal;
  onAdd: typeof onboardingActions.openModal;
  pagination: any;
  query: any;
  currentFilterType: string;
  currentFilterValue: string;
}

interface State {
  selected: string[];
  expanded: string[];
}

class SourceSettings extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      expanded: [],
    };
    this.onSelect = this.onSelect.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onUpdateFilter = this.onUpdateFilter.bind(this);
  }

  public componentDidMount() {
    this.props.fetch();
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

  public onSearch(searchQuery) {
    const newQuery = { ...this.props.query, ...searchQuery };
    const res = Object.keys(newQuery)
      .filter(k => newQuery[k])
      .reduce((acc, curr) => {
        const currQuery = `${curr}=${newQuery[curr]}`;
        return acc === null ? currQuery : `${acc}&${currQuery}`;
      }, null);
    this.props.fetch(res);
  }

  public onSelect(event, isSelected, rowId) {
    if (rowId === -1) {
      this.setState(prevState => ({
        selected: isSelected
          ? this.props.sources.map(src => `${src.name}-${src.type}`)
          : [],
      }));
      return;
    }

    const source = this.props.sources[rowId / 2];
    if (isSelected) {
      this.setState(prevState => ({
        selected: [...prevState.selected, `${source.name}-${source.type}`],
      }));
    }

    if (!isSelected) {
      this.setState(prevState => {
        const ix = prevState.selected.indexOf(`${source.name}-${source.type}`);
        return {
          selected: [
            ...prevState.selected.slice(0, ix),
            ...prevState.selected.slice(ix + 1),
          ],
        };
      });
    }
  }

  public onCollapse(event, rowKey, isOpen) {
    const src = this.props.sources[rowKey / 2];
    if (isOpen) {
      this.setState(prevState => ({
        expanded: [...prevState.expanded, `${src.name}-${src.type}`],
      }));
      return;
    }

    this.setState(prevState => {
      const ix = prevState.expanded.indexOf(`${src.name}-${src.type}`);
      return {
        expanded: [
          ...prevState.expanded.slice(0, ix),
          ...prevState.expanded.slice(ix + 1),
        ],
      };
    });
  }

  public render() {
    const {
      pagination,
      sources,
      status,
      error,
      t,
      onAdd,
      remove,
      showDeleteDialog,
    } = this.props;
    const columns = [
      t('source_details.column.name'),
      t('source_details.column.type'),
      t('source_details.column.added_by'),
      t('source_details.column.date_added'),
      '',
    ];
    const rows = sources.map((src, ix) => ({
      cells: RowCell(t, src, () => {
        showDeleteDialog({
          name: src.name,
          type: src.type,
          onDelete: () => {
            remove(src.uuid);
          },
        });
      }),
    }));

    const filterValue = Object.keys(this.props.query)
      .filter(k => ['name', 'type'].includes(k))
      .find(k => this.props.query[k]);

    return (
      <div className={css(styles.sourceSettings)}>
        <Header t={t} />
        <div className={css(styles.content)}>
          {status === FetchStatus.complete && (rows.length > 0 || filterValue) && (
            <div className={css(styles.toolbarContainer)}>
              <Toolbar>
                <FilterToolbar
                  t={t}
                  onSearch={this.onSearch}
                  options={{
                    name: t('source_details.column.name'),
                    type: t('source_details.column.type'),
                  }}
                  value={this.props.currentFilterValue}
                  selected={this.props.currentFilterType}
                  onChange={this.onUpdateFilter}
                />
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      onClick={() => {
                        onAdd();
                      }}
                      variant="tertiary"
                    >
                      {t('source_details.add_source')}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup style={{ marginLeft: 'auto' }}>
                  <ToolbarItem>
                    <SourcePagination
                      status={status}
                      fetchSources={this.onSearch}
                      pagination={pagination}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
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
                <SourceTable
                  // TODO: Uncomment when bulk delete is available
                  // onSelect={this.onSelect}
                  onCollapse={this.onCollapse}
                  columns={columns}
                  rows={rows}
                />
                <div className={css(styles.paginationContainer)}>
                  <SourcePagination
                    status={status}
                    fetchSources={this.onSearch}
                    pagination={pagination}
                  />
                </div>
              </React.Fragment>
            )}
          {status === FetchStatus.complete &&
            filterValue === undefined &&
            rows.length === 0 && <NoSourcesState />}
          {status === FetchStatus.complete &&
            filterValue &&
            rows.length === 0 && <NoMatchFoundState />}
        </div>
      </div>
    );
  }
}

export default translate()(SourceSettings);
