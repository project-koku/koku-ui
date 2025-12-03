import type { CostModel } from '@koku-ui/api/costModels';
import messages from '@koku-ui/i18n/locales/messages';
import { EmptyState, EmptyStateBody, Title, TitleSizes } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { rbacSelectors } from '../../../../store/rbac';
import { EmptyFilterState } from '../../../components/state/emptyFilterState';
import { addMultiValueQuery, removeMultiValueQuery } from '../components/filterLogic';
import SourcesTable from './sourcesTable';
import { SourcesToolbar } from './sourcesToolbar';
import { styles } from './table.styles';
import { getSourceType } from './utils/sourceType';

interface TableBaseProps extends WrappedComponentProps {
  isWritePermission: boolean;
  rows: string[];
  onDelete: (item: any) => void;
  onDeleteText?: string;
  onAdd: () => void;
  current: CostModel;
}

interface TableBaseState {
  query: { name: string[] };
  currentFilter: string;
  filter: string;
}

class TableBase extends React.Component<TableBaseProps, TableBaseState> {
  protected defaultState: TableBaseState = {
    query: { name: [] },
    currentFilter: '',
    filter: '',
  };
  public state: TableBaseState = { ...this.defaultState };

  public render() {
    const { current, intl, isWritePermission, onAdd, rows } = this.props;

    const filteredRows = rows
      .filter(uuid => {
        if (!this.state.query.name) {
          return true;
        }
        return this.state.query.name.every(fName => uuid.includes(fName));
      })
      .map(uuid => [uuid]);

    // Note: Removed pagination props because the /cost-models/{cost_model_uuid}/ API does not support pagination
    // See https://issues.redhat.com/browse/COST-2097
    return (
      <>
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.sourceTypeTitle}>
          {intl.formatMessage(messages.sourceType)}: {current.source_type}
        </Title>
        <SourcesToolbar
          actionButtonProps={{
            isDisabled: !isWritePermission,
            onClick: onAdd,
            children: intl.formatMessage(messages.costModelsAssignSources, { count: 1 }),
          }}
          filter={{
            onClearAll: () =>
              this.setState({
                query: { name: [] },
              }),
            onRemove: (_category, chip) => {
              this.setState({
                query: removeMultiValueQuery(this.state.query)('name', chip),
              });
            },
            query: this.state.query,
            categoryNames: { name: intl.formatMessage(messages.names, { count: 1 }) },
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
                filter: this.state.currentFilter,
              });
            },
            value: this.state.currentFilter,
            placeholder: intl.formatMessage(messages.costModelsFilterPlaceholder),
          }}
        />
        {filteredRows.length > 0 && (
          <SourcesTable
            showDeleteDialog={(rowId: number) => {
              this.props.onDelete(filteredRows[rowId]);
            }}
            showOperatorVersion={getSourceType(current.source_type) === 'OCP'}
          />
        )}
        {rows.length === 0 && (
          <div style={styles.emptyState}>
            <EmptyState
              headingLevel="h2"
              icon={PlusCircleIcon}
              titleText={intl.formatMessage(messages.costModelsSourceEmptyStateDesc)}
            >
              <EmptyStateBody>{intl.formatMessage(messages.costModelsSourceEmptyStateTitle)}</EmptyStateBody>
            </EmptyState>
          </div>
        )}
        {filteredRows.length === 0 && rows.length > 0 && (
          <EmptyFilterState filter={this.state.filter} subTitle={messages.emptyFilterSourceStateSubtitle} />
        )}
      </>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => ({
      isWritePermission: rbacSelectors.isCostModelWritePermission(state),
    }))
  )(TableBase)
);
