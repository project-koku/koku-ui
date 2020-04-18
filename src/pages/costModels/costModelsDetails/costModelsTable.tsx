import { Button, List, ListItem } from '@patternfly/react-core';
import {
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableGridBreakpoint,
  TableHeader,
} from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { relativeTime } from 'human-date';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import Dialog from './components/dialog';
import { styles } from './costModelsDetails.styles';
import { costModelsTableMap, getSortByData, reverseMap } from './sort';

interface TableProps extends InjectedTranslateProps {
  isWritePermissions: boolean;
  columns: string[];
  rows: CostModel[];
  setUuid: (uuid: string) => void;
  showDeleteDialog: () => void;
  isDialogOpen: { deleteCostModel: boolean; updateCostModel: boolean };
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  deleteCostModel: typeof costModelsActions.deleteCostModel;
  isDeleteProcessing: boolean;
  deleteError: string;
  sortBy?: string;
  onOrdering: (query: { [k: string]: string }) => void;
}

interface TableState {
  rowId: number;
}

class CostModelsTable extends React.Component<TableProps, TableState> {
  public state = { rowId: 0 };
  public render() {
    const {
      deleteCostModel,
      deleteError,
      isDeleteProcessing,
      showDeleteDialog,
      isDialogOpen,
      setDialogOpen,
      columns,
      rows,
      t,
      setUuid,
      onOrdering,
      sortBy,
      isWritePermissions,
    } = this.props;
    const linkedRows = rows.map(row => {
      return {
        cells: [
          {
            title: (
              <Button onClick={() => setUuid(row.uuid)} variant="link">
                {row.name}
              </Button>
            ),
          },
          row.description,
          row.source_type,
          String(row.sources.length),
          relativeTime(row.updated_timestamp),
        ],
      };
    });
    const cm = rows[this.state.rowId];
    return (
      <>
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteCostModel}
          title={t('dialog.delete_cost_model_title', { cost_model: cm.name })}
          onClose={() =>
            setDialogOpen({ name: 'deleteCostModel', isOpen: false })
          }
          error={deleteError}
          isProcessing={isDeleteProcessing}
          onProceed={() => {
            deleteCostModel(cm.uuid, 'deleteCostModel');
          }}
          body={
            <>
              {cm.sources.length === 0 &&
                t('dialog.delete_cost_model_body_green', {
                  cost_model: cm.name,
                })}
              {cm.sources.length > 0 && (
                <>
                  {t('dialog.delete_cost_model_body_red', {
                    cost_model: cm.name,
                  })}
                  <br />
                  <br />
                  {t('dialog.delete_cost_model_body_red_costmodel_delete')}
                  <br />
                  <List>
                    {cm.sources.map(provider => (
                      <ListItem key={`${provider.uuid}`}>
                        {provider.name}
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          }
          actionText={
            rows[this.state.rowId].sources.length === 0
              ? t('dialog.deleteCostModel')
              : ''
          }
        />
        <div style={styles.tableContainer}>
          <Table
            gridBreakPoint={TableGridBreakpoint.grid2xl}
            sortBy={getSortByData(sortBy, costModelsTableMap)}
            onSort={(_evt, index, direction) => {
              const selectedIndex = reverseMap(costModelsTableMap)[index];
              if (sortBy === null) {
                onOrdering({ ordering: selectedIndex });
                return;
              }
              const indexName =
                sortBy[0] === '-'
                  ? sortBy.slice(1).toLowerCase()
                  : sortBy.toLowerCase();
              if (indexName === selectedIndex) {
                onOrdering({
                  ordering:
                    direction === SortByDirection.desc
                      ? `-${indexName}`
                      : indexName,
                });
                return;
              }
              onOrdering({
                ordering: selectedIndex,
              });
            }}
            aria-label="cost-models-table"
            cells={columns.map(cell => {
              if (
                [
                  t('cost_models_details.table.columns.name'),
                  t('cost_models_details.table.columns.source_type'),
                  t('cost_models_details.table.columns.last_modified'),
                ].includes(cell)
              ) {
                return {
                  title: cell,
                  transforms: [sortable],
                };
              }
              return cell;
            })}
            rows={linkedRows}
            actions={[
              {
                title: t('cost_models_details.action_view'),
                onClick: (_evt, rowId) => {
                  setUuid(rows[rowId].uuid);
                },
              },
              {
                // HACK: allow tooltip on disabled
                style: !isWritePermissions
                  ? { pointerEvents: 'auto' }
                  : undefined,
                tooltip: !isWritePermissions ? (
                  <div>{t('cost_models.read_only_tooltip')}</div>
                ) : (
                  undefined
                ),
                isDisabled: !isWritePermissions,
                title: isWritePermissions ? (
                  <div style={{ color: 'red' }}>
                    {t('cost_models_details.action_delete')}
                  </div>
                ) : (
                  t('cost_models_details.action_delete')
                ),
                onClick: (_evt, rowId) => {
                  this.setState({ rowId }, () => showDeleteDialog());
                },
              },
            ]}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </div>
      </>
    );
  }
}
export default connect(
  createMapStateToProps(state => ({
    isDialogOpen: costModelsSelectors.isDialogOpen(state)('costmodel'),
    isDeleteProcessing: costModelsSelectors.deleteProcessing(state),
    deleteError: costModelsSelectors.deleteError(state),
    current: costModelsSelectors.selected(state),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    deleteCostModel: costModelsActions.deleteCostModel,
  }
)(translate()(CostModelsTable));
