import type { CostModel } from '@koku-ui/api/costModels';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { ICell, ThProps } from '@patternfly/react-table';
import { sortable, Table, TableGridBreakpoint, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { rbacSelectors } from '../../../../store/rbac';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { ReadOnlyTooltip } from '../components/readOnlyTooltip';
import type { CostModelsQuery } from './utils/query';
import { createOnSort, getRowsByStateName } from './utils/table';

interface CostModelsTableOwnProps {
  actionResolver?: any;
  openDeleteDialog?: any;
}

interface CostModelsTableState {
  dialogSource: string;
  activeSortDirection: string;
  activeSortIndex: number;
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

class CostModelsTableBase extends React.Component<CostModelsTableProps, CostModelsTableState> {
  protected defaultState: CostModelsTableState = {
    dialogSource: null,
    activeSortDirection: 'asc',
    activeSortIndex: 0,
  };
  public state: CostModelsTableState = { ...this.defaultState };

  public render() {
    const {
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
        title: intl.formatMessage(messages.sourceType),
        data: { orderName: 'source_type' },
        ...(rows.length && { transforms: [sortable] }),
      },
      { title: intl.formatMessage(messages.costModelsAssignedSources) },
      {
        title: intl.formatMessage(messages.costModelsLastUpdated),
        data: { orderName: 'updated_timestamp' },
        ...(rows.length && { transforms: [sortable] }),
      },
      {
        title: '',
        props: { 'aria-label': intl.formatMessage(messages.costModelsActions) },
      },
    ] as ICell[];

    const onSort = createOnSort(cells, query, router);
    const getSortParams = (columnIndex: number): ThProps['sort'] => ({
      sortBy: {
        index: this.state.activeSortIndex,
        direction: this.state.activeSortDirection as 'asc' | 'desc',
        defaultDirection: 'asc',
      },
      onSort: (_evt, index, direction) => {
        this.setState({
          ...this.state,
          activeSortDirection: direction,
          activeSortIndex: index,
        });
        onSort(_evt, index, direction);
      },
      columnIndex,
    });

    return (
      <Table
        aria-label={intl.formatMessage(messages.costModelsTableAriaLabel)}
        gridBreakPoint={TableGridBreakpoint.grid2xl}
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            {cells.map((c, cellIndex) => (
              <Th
                aria-label={(c.title as string) || ' '}
                key={cellIndex}
                sort={c.transforms ? getSortParams(cellIndex) : undefined}
              >
                {c.title}
              </Th>
            ))}
            <Th aria-label={intl.formatMessage(messages.costModelsActions)}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((r, rowIndex) => (
            <Tr key={rowIndex}>
              {r.cells.map((c, cellIndex) => (
                <Td colSpan={c.props ? c.props.colSpan : undefined} key={cellIndex}>
                  {c.title ? c.title : c}
                </Td>
              ))}
              {!r.heightAuto && stateName === 'success' && (
                <Td isActionCell>
                  <ReadOnlyTooltip defaultMsg={messages.costModelsDelete} key="action" isDisabled={!canWrite}>
                    <Button
                      icon={<MinusCircleIcon />}
                      aria-label={intl.formatMessage(messages.delete)}
                      isAriaDisabled={!canWrite}
                      onClick={() => openDeleteDialog(r.data)}
                      size="sm"
                      variant={ButtonVariant.plain}
                    ></Button>
                  </ReadOnlyTooltip>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
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
