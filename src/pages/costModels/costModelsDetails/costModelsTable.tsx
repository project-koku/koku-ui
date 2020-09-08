import {
  IAction,
  ICell,
  IRow,
  ISortBy,
  sortable,
  SortByDirection,
} from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { relativeTime } from 'human-date';
import { stringify } from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { RootState } from 'store/rootReducer';
import { TableTemplate } from 'pages/costModels/components/tableTemplate';

const genActions = (
  canWrite: boolean,
  showDeleteDialog: (rowId: number) => void
): IAction[] => {
  if (canWrite) {
    return [
      {
        title: 'cost_models_details.action_delete',
        onClick: (_evt, rowIndex: number) => showDeleteDialog(rowIndex),
      },
    ];
  }
  return [
    {
      style: { pointerEvents: 'auto' },
      tooltip: 'cost_models.read_only_tooltip',
      isDisabled: true,
      title: 'cost_models_details.action_delete',
    },
  ];
};

const transformCostModelsToRows = (costModels: CostModel[]): IRow[] => {
  return costModels.map(costModel => {
    return {
      cells: [
        {
          title: (
            <Link to={`/cost-models/${costModel.uuid}`}>{costModel.name}</Link>
          ),
        },
        costModel.description,
        costModel.source_type,
        costModel.sources.length.toString(),
        relativeTime(costModel.updated_timestamp),
      ],
    };
  });
};

const genOrderParam = (key: string, direction: SortByDirection) => {
  if (direction === SortByDirection.asc) {
    return key;
  }
  return `-${key}`;
};

const getSortBy = (
  query: { [k: string]: string },
  cells: (string | ICell)[]
): ISortBy => {
  const ordering = query.ordering;
  if (!ordering) {
    return {};
  }
  const direction =
    ordering[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
  const sortKey =
    direction === SortByDirection.desc ? ordering.slice(1) : ordering;
  const index = cells.findIndex(cell => {
    if (typeof cell === 'string' || !cell.data) {
      return false;
    }
    return cell.data.key === sortKey;
  });
  return { direction, index };
};

interface OwnProps {
  deleteAction: (rowId: number) => void;
}

const CostModelTable = connect(
  (state: RootState) => {
    return {
      query: costModelsSelectors.query(state),
      costModels: costModelsSelectors.costModels(state),
      canWrite: rbacSelectors.isCostModelWritePermission(state),
    };
  },
  dispatch => {
    return {
      fetch: (query: string) =>
        costModelsActions.fetchCostModels(query)(dispatch),
    };
  },
  (stateProps, dispatchProps, ownProps: OwnProps) => {
    const cells: (string | ICell)[] = [
      {
        title: 'cost_models_details.table.columns.name',
        transforms: [sortable],
        data: { key: 'name' },
      },
      { title: 'cost_models_details.table.columns.desc' },
      {
        title: 'cost_models_details.table.columns.source_type',
        transforms: [sortable],
        data: { key: 'source_type' },
      },
      { title: 'cost_models_details.table.columns.sources' },
      {
        title: 'cost_models_details.table.columns.last_modified',
        transforms: [sortable],
        data: { key: 'updated_timestamp' },
      },
    ];
    const actions = genActions(stateProps.canWrite, ownProps.deleteAction);
    return {
      'aria-label': 'cost-models-table',
      sortBy: getSortBy(stateProps.query, cells),
      onSort: (
        _evt: React.MouseEvent,
        _index: number,
        direction: SortByDirection,
        extraData: any
      ) => {
        const { key } = extraData.column.data;
        const newQuery = stringify({
          ...stateProps.query,
          ordering: genOrderParam(key, direction),
        });
        dispatchProps.fetch(newQuery);
      },
      rows: transformCostModelsToRows(stateProps.costModels),
      cells,
      actions,
    };
  }
)(TableTemplate);

export default CostModelTable;
