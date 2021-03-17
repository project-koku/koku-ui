import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import {
  ICell,
  IRowData,
  sortable,
  Table,
  TableBody,
  TableGridBreakpoint,
  TableHeader,
  TableProps,
} from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

import { CostModelsQuery, parseOrdering } from './utils/query';
import { createActions, createOnSort, getRowsByStateName } from './utils/table';

function CostModelsTableBase(props: TableProps): JSX.Element {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Table
        gridBreakPoint={TableGridBreakpoint.grid2xl}
        actions={props.actions}
        actionResolver={props.actionResolver}
        rows={props.rows}
        cells={props.cells}
        onSort={props.onSort}
        sortBy={props.sortBy}
        aria-label={props['aria-label']}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </PageSection>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    canWrite: rbacSelectors.isCostModelWritePermission(state),
    query: costModelsSelectors.query(state) as CostModelsQuery,
    costData: costModelsSelectors.costModels(state),
    stateName: costModelsSelectors.stateName(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  const setDialogActionCreator = costModelsActions.setCostModelDialog;
  return {
    openDeleteDialog: (item: CostModel) =>
      dispatch(setDialogActionCreator({ name: 'deleteCostModel', isOpen: true, meta: item })),
  };
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>,
  ownProps: WithTranslation & RouteComponentProps
) => {
  const {
    t,
    history: { push },
  } = ownProps;
  const cells = [
    { title: t('page_cost_models.name'), transforms: [sortable], data: { orderName: 'name' } },
    { title: t('page_cost_models.description') },
    { title: t('page_cost_models.source_type'), transforms: [sortable], data: { orderName: 'source_type' } },
    { title: t('page_cost_models.assigned_sources') },
    { title: t('page_cost_models.last_change'), transforms: [sortable], data: { orderName: 'updated_timestamp' } },
  ] as ICell[];

  const sortBy = parseOrdering(stateProps.query, cells);
  const onSort = createOnSort(cells, stateProps.query, push);
  const rows = getRowsByStateName(stateProps.stateName, stateProps.costData);
  const actions = createActions(stateProps.stateName, stateProps.canWrite, [
    {
      title: t('page_cost_models.delete'),
      tooltip: t('cost_models.read_only_tooltip'),
      onClick: (_evt: React.MouseEvent, _rowIx: number, rowData: IRowData) => {
        dispatchProps.openDeleteDialog(rowData.data);
      },
    },
  ]);

  return {
    'aria-label': 'cost-models',
    cells,
    rows,
    sortBy,
    onSort,
    actions,
  };
};

const CostModelsTable = withRouter(
  withTranslation()(connect(mapStateToProps, mapDispatchToProps, mergeProps)(CostModelsTableBase))
);

export default CostModelsTable;
