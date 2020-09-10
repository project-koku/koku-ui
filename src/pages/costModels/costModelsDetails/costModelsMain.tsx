import { List, ListItem } from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import Dialog from './components/dialog';
import { styles } from './costModelsDetails.styles';
import CostModelsTable from './costModelsTable';

interface TableProps extends InjectedTranslateProps {
  rows: CostModel[];
  showDeleteDialog: () => void;
  isDialogOpen: { deleteCostModel: boolean; updateCostModel: boolean };
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  deleteCostModel: typeof costModelsActions.deleteCostModel;
  isDeleteProcessing: boolean;
  deleteError: string;
}

interface TableState {
  rowId: number;
}

class CostModelsMain extends React.Component<TableProps, TableState> {
  public state = { rowId: 0 };
  public render() {
    const {
      deleteCostModel,
      deleteError,
      isDeleteProcessing,
      showDeleteDialog,
      isDialogOpen,
      setDialogOpen,
      rows,
      t,
    } = this.props;
    const cm = rows[this.state.rowId];
    return (
      <>
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteCostModel}
          title={t('dialog.delete_cost_model_title')}
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
          <CostModelsTable
            deleteAction={(rowId: number) => {
              this.setState({ rowId }, () => showDeleteDialog());
            }}
          />
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
)(translate()(CostModelsMain));
