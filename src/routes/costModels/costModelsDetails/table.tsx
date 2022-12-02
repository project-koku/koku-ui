import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import type { ICell, IRowData } from '@patternfly/react-table';
import { sortable, Table, TableBody, TableGridBreakpoint, TableHeader } from '@patternfly/react-table';
import type { CostModel } from 'api/costModels';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import type { CostModelsQuery } from './utils/query';
import { parseOrdering } from './utils/query';
import { createActions, createOnSort, getRowsByStateName } from './utils/table';

interface CostModelsTableOwnProps {
  actionResolver?: any;
  openDeleteDialog?: any;
}

interface CostModelsTableStateProps {
  canWrite: boolean;
  costData: any;
  query: any;
  stateName: string;
}

type CostModelsTableProps = CostModelsTableOwnProps &
  CostModelsTableStateProps &
  RouterComponentProps &
  WrappedComponentProps;

class CostModelsTableBase extends React.Component<CostModelsTableProps> {
  public state = { dialogSource: null };
  public render() {
    const {
      actionResolver,
      intl = defaultIntl, // Default required for testing
      canWrite,
      costData,
      openDeleteDialog,
      query,
      router,
      stateName,
    } = this.props;

    const rows = getRowsByStateName(stateName, costData);
    const cells = [
      {
        title: intl.formatMessage(messages.names, { count: 1 }),
        data: { orderName: 'name' },
        ...(rows.length && { transforms: [sortable] }),
      },
      { title: intl.formatMessage(messages.description) },
      {
        title: intl.formatMessage(messages.costModelsSourceType),
        data: { orderName: 'source_type' },
        ...(rows.length && { transforms: [sortable] }),
      },
      { title: intl.formatMessage(messages.costModelsAssignedSources) },
      {
        title: intl.formatMessage(messages.costModelsLastChange),
        data: { orderName: 'updated_timestamp' },
        ...(rows.length && { transforms: [sortable] }),
      },
      {
        title: '',
        props: { 'aria-label': intl.formatMessage(messages.costModelsActions) },
      },
    ] as ICell[];

    const sortBy = parseOrdering(query, cells);
    const onSort = createOnSort(cells, query, router);
    const actions = createActions(stateName, canWrite, [
      {
        title: intl.formatMessage(messages.delete),
        tooltip: intl.formatMessage(messages.costModelsReadOnly),
        onClick: (_evt: React.MouseEvent, _rowIx: number, rowData: IRowData) => {
          openDeleteDialog(rowData.data);
        },
      },
    ]);

    return (
      <PageSection variant={PageSectionVariants.light}>
        <Table
          gridBreakPoint={TableGridBreakpoint.grid2xl}
          actions={actions}
          actionResolver={actionResolver}
          rows={rows}
          cells={cells}
          onSort={onSort}
          sortBy={sortBy}
          aria-label={intl.formatMessage(messages.costModelsTableAriaLabel)}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </PageSection>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostModelsTableOwnProps, CostModelsTableStateProps>(state => {
  return {
    canWrite: rbacSelectors.isCostModelWritePermission(state),
    query: costModelsSelectors.query(state) as CostModelsQuery,
    costData: costModelsSelectors.costModels(state),
    stateName: costModelsSelectors.stateName(state),
  };
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  const setDialogActionCreator = costModelsActions.setCostModelDialog;
  return {
    openDeleteDialog: (item: CostModel) =>
      dispatch(setDialogActionCreator({ name: 'deleteCostModel', isOpen: true, meta: item })),
  };
};

const CostModelsTableConnect = connect(mapStateToProps, mapDispatchToProps)(CostModelsTableBase);
const CostModelsTable = injectIntl(withRouter(CostModelsTableConnect));

export default CostModelsTable;
