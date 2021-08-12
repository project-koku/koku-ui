import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, TitleSizes } from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons/dist/js/icons/dollar-sign-icon';
import { CostModel } from 'api/costModels';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { addMultiValueQuery, removeMultiValueQuery } from 'pages/costModels/components/filterLogic';
import { PaginationToolbarTemplate } from 'pages/costModels/components/paginationToolbarTemplate';
import SourcesTable from 'pages/costModels/costModel/sourcesTable';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { rbacSelectors } from 'store/rbac';

import { SourcesToolbar } from './sourcesToolbar';
import { styles } from './table.styles';

interface Props extends WithTranslation {
  isWritePermission: boolean;
  rows: string[];
  onDelete: (item: any) => void;
  onDeleteText?: string;
  onAdd: () => void;
  current: CostModel;
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
    const { current, onAdd, t, rows, isWritePermission } = this.props;
    const filteredRows = rows
      .filter(uuid => {
        if (!this.state.query.name) {
          return true;
        }
        return this.state.query.name.every(fName => uuid.includes(fName));
      })
      .map(uuid => [uuid]);
    const res = filteredRows.slice((page - 1) * perPage, page * perPage);
    return (
      <>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.sourceTypeTitle}>
          {t('cost_models_details.cost_model.source_type')}: {current.source_type}
        </Title>
        <SourcesToolbar
          actionButtonProps={{
            isDisabled: !isWritePermission,
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
            categoryNames: { name: t('name') },
          }}
          paginationProps={{
            isCompact: true,
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
          filterInputProps={{
            id: 'sources-tab-toolbar',
            onChange: (value: string) =>
              this.setState({
                currentFilter: value,
              }),
            onSearch: () => {
              this.setState({
                query: addMultiValueQuery(this.state.query)('name', this.state.currentFilter),
                currentFilter: '',
                pagination: { ...this.state.pagination, page: 1 },
              });
            },
            value: this.state.currentFilter,
            placeholder: t('toolbar.sources.filter_placeholder'),
          }}
        />
        {res.length > 0 && (
          <SourcesTable
            showDeleteDialog={(rowId: number) => {
              this.props.onDelete(res[rowId]);
            }}
          />
        )}
        {rows.length === 0 && (
          <div style={styles.emptyState}>
            <EmptyState>
              <EmptyStateIcon icon={DollarSignIcon} />
              <Title headingLevel="h2" size={TitleSizes.lg}>
                {t('cost_models_details.empty_state_source.title')}
              </Title>
              <EmptyStateBody>{t('cost_models_details.empty_state_source.description')}</EmptyStateBody>
            </EmptyState>
          </div>
        )}
        {filteredRows.length === 0 && rows.length > 0 && (
          <EmptyFilterState filter={this.state.currentFilter} subTitle={t('no_match_found_state.desc')} />
        )}
        <PaginationToolbarTemplate
          id="costmodels_details_filter_datatoolbar"
          aria-label="cost_models_details.sources_filter_controller"
          variant="bottom"
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
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isWritePermission: rbacSelectors.isCostModelWritePermission(state),
  }))
)(withTranslation()(TableBase));
