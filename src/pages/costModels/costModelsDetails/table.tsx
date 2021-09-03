import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { ICell, IRowData, sortable, Table, TableBody, TableGridBreakpoint, TableHeader } from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { intlMock } from 'components/i18n';

import { CostModelsQuery, parseOrdering } from './utils/query';
import { createActions, createOnSort, getRowsByStateName } from './utils/table';

interface CostModelsTableOwnProps {
  actionResolver?: any;
  history: any;
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
  RouteComponentProps<void> &
  WrappedComponentProps;

class CostModelsTableBase extends React.Component<CostModelsTableProps> {
  public state = { dialogSource: null };
  public render() {
    const {
      actionResolver,
      intl = intlMock,
      canWrite,
      costData,
      history: { push },
      openDeleteDialog,
      query,
      stateName,
    } = this.props;

    const cells = [
      { title: intl.formatMessage(messages.Names, { count: 1 }), transforms: [sortable], data: { orderName: 'name' } },
      { title: intl.formatMessage(messages.Description) },
      {
        title: intl.formatMessage(messages.CostModelsSourceType),
        transforms: [sortable],
        data: { orderName: 'source_type' },
      },
      { title: intl.formatMessage(messages.CostModelsAssignSources) },
      {
        title: intl.formatMessage(messages.CostModelsLastChange),
        transforms: [sortable],
        data: { orderName: 'updated_timestamp' },
      },
    ] as ICell[];

    const sortBy = parseOrdering(query, cells);
    const onSort = createOnSort(cells, query, push);
    const rows = getRowsByStateName(stateName, costData);
    const actions = createActions(stateName, canWrite, [
      {
        title: intl.formatMessage(messages.Delete),
        tooltip: intl.formatMessage(messages.CostModelsReadOnly),
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
          aria-label={intl.formatMessage(messages.CostModelsTableAriaLabel)}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </PageSection>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostModelsTableOwnProps, CostModelsTableStateProps>((state, props) => {
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
const CostModelsTable = withRouter(injectIntl(CostModelsTableConnect));

export default CostModelsTable;
