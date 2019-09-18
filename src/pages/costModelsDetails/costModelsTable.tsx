import { Button, List, ListItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { CostModel } from 'api/costModels';
import { relativeTime } from 'human-date';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import Dialog from './components/dialog';
import { styles } from './costModelsDetails.styles';

interface TableProps extends InjectedTranslateProps {
  columns: string[];
  rows: CostModel[];
  setUuid: (uuid: string) => void;
  showDeleteDialog: () => void;
  isDialogOpen: { deleteCostModel: boolean };
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  deleteCostModel: typeof costModelsActions.deleteCostModel;
  isDeleteProcessing: boolean;
  deleteError: string;
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
    } = this.props;
    const linkedRows = rows.map(row => {
      return [
        {
          title: (
            <Button onClick={() => setUuid(row.uuid)} variant="link">
              {row.name}
            </Button>
          ),
        },
        row.description,
        String(row.providers.length),
        relativeTime(row.updated_timestamp),
      ];
    });
    const cm = rows[this.state.rowId];
    return (
      <>
        <Dialog
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
              {cm.providers.length === 0 &&
                t('dialog.delete_cost_model_body_green', {
                  cost_model: cm.name,
                })}
              {cm.providers.length > 0 && (
                <>
                  {t('dialog.delete_cost_model_body_red', {
                    cost_model: cm.name,
                  })}
                  <br />
                  <br />
                  {t('dialog.delete_cost_model_body_red_costmodel_delete')}
                  <br />
                  <List>
                    {cm.providers.map(provider => (
                      <ListItem>{provider.name}</ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          }
          actionText={
            rows[this.state.rowId].providers.length === 0
              ? t('dialog.deleteCostModel')
              : ''
          }
        />
        <div className={css(styles.tableContainer)}>
          <Table
            aria-label="cost-models-table"
            cells={columns}
            rows={linkedRows}
            actions={[
              {
                title: t('cost_models_details.action_delete'),
                onClick: (_evt, rowId) => {
                  this.setState({ rowId }, () => showDeleteDialog());
                },
              },
              {
                title: t('cost_models_details.action_view'),
                onClick: (_evt, rowId) => {
                  setUuid(rows[rowId].uuid);
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
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    deleteCostModel: costModelsActions.deleteCostModel,
  }
)(translate()(CostModelsTable));
