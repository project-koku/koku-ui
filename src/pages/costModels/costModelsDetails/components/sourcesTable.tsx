import { IAction, ICell, IRow } from '@patternfly/react-table';
import { TableTemplate } from 'pages/costModels/components/tableTemplate';
import { connect } from 'react-redux';
import { RootState } from 'store';
import { costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

const genActions = (canWrite: boolean, showDeleteDialog: (rowId: number) => void): IAction[] => {
  if (canWrite) {
    return [
      {
        title: 'cost_models_details.action_unassign',
        onClick: (_evt, rowIndex: number) => showDeleteDialog(rowIndex),
      },
    ];
  }
  return [
    {
      style: { pointerEvents: 'auto' },
      tooltip: 'cost_models.read_only_tooltip',
      isDisabled: true,
      title: 'cost_models_details.action_unassign',
    },
  ];
};

interface OwnProps {
  showDeleteDialog: (rowId: number) => void;
}

const SourcesTable = connect(
  (state: RootState) => {
    return {
      canWrite: rbacSelectors.isCostModelWritePermission(state),
      costModels: costModelsSelectors.costModels(state),
    };
  },
  undefined,
  (stateProps, _, ownProps: OwnProps) => {
    const actions = genActions(stateProps.canWrite, ownProps.showDeleteDialog);
    const rows: (IRow | string[])[] =
      stateProps.costModels.length > 0 ? stateProps.costModels[0].sources.map(source => [source.name]) : [];
    return {
      'aria-label': 'sources-table',
      cells: ['filter.name'] as (string | ICell)[],
      rows,
      actions,
    };
  }
)(TableTemplate);

export default SourcesTable;
