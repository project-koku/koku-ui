import {
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
import { css } from '@patternfly/react-styles';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import {
  addMultiValueQuery,
  removeMultiValueQuery,
} from 'pages/createCostModelWizard/filterLogic';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { SourcesToolbar } from './sourcesToolbar';
import { styles } from './table.styles';

interface Props extends InjectedTranslateProps {
  rows: string[];
  cells: string[];
  onDelete: (item: object) => void;
  onDeleteText?: string;
  onAdd: () => void;
}

interface PaginationQuery {
  page: number;
  perPage: number;
}

interface State {
  query: { name: string[] };
  currentFilter: string;
  pagination: PaginationQuery;
}

class TableBase extends React.Component<Props, State> {
  public state = {
    query: { name: [] },
    currentFilter: '',
    pagination: { page: 1, perPage: 10 },
  };
  public render() {
    const {
      pagination: { page, perPage },
    } = this.state;
    const { onAdd, t, rows, cells } = this.props;
    const filteredRows = rows
      .filter(uuid => {
        if (!Boolean(this.state.query.name)) {
          return true;
        }
        return this.state.query.name.every(fName => uuid.includes(fName));
      })
      .map(uuid => [uuid]);
    const res = filteredRows.slice((page - 1) * perPage, page * perPage);
    return (
      <>
        <SourcesToolbar
          actionButtonProps={{
            onClick: onAdd,
            children: t('toolbar.sources.assign_sources'),
          }}
          filter={{
            onClearAll: () =>
              this.setState({
                pagination: { ...this.state.pagination, page: 1 },
                query: { name: [] },
              }),
            onRemove: (_category, chip) => {
              this.setState({
                pagination: { ...this.state.pagination, page: 1 },
                query: removeMultiValueQuery(this.state.query)('name', chip),
              });
            },
            query: this.state.query,
            categoryNames: { name: t('toolbar.sources.category.name') },
          }}
          paginationProps={{
            itemCount: filteredRows.length,
            perPage,
            page,
            onSetPage: (_evt, newPage) =>
              this.setState({
                pagination: {
                  ...this.state.pagination,
                  page: newPage,
                },
              }),
            onPerPageSelect: (_evt, newPerPage) =>
              this.setState({
                pagination: { page: 1, perPage: newPerPage },
              }),
          }}
          searchInputProps={{
            id: 'sources-tab-toolbar',
            onChange: (value: string) =>
              this.setState({
                currentFilter: value,
              }),
            onSearch: () => {
              this.setState({
                query: addMultiValueQuery(this.state.query)(
                  'name',
                  this.state.currentFilter
                ),
                currentFilter: '',
                pagination: { ...this.state.pagination, page: 1 },
              });
            },
            value: this.state.currentFilter,
            placeholder: t('toolbar.sources.filter_placeholder'),
          }}
        />
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
            filter={this.state.currentFilter}
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
