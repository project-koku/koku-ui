import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsActions } from 'store/metrics';
import { rbacActions, rbacSelectors } from 'store/rbac';

import CostModelsDetails from './costModelsDetails';

export default connect(
  createMapStateToProps(state => ({
    costModels: costModelsSelectors.costModels(state),
    error: costModelsSelectors.error(state),
    status: costModelsSelectors.status(state),
    pagination: costModelsSelectors.pagination(state),
    query: costModelsSelectors.query(state),
    currentFilterValue: costModelsSelectors.currentFilterValue(state),
    currentFilterType: costModelsSelectors.currentFilterType(state),
    currentCostModel: costModelsSelectors.selected(state),
    isWritePermission: rbacSelectors.isCostModelWritePermission(state),
  })),
  {
    updateFilter: costModelsActions.updateFilterToolbar,
    fetch: costModelsActions.fetchCostModels,
    notify: addNotification,
    resetCurrentCostModel: costModelsActions.resetCostModel,
    setCurrentCostModel: costModelsActions.selectCostModel,
    setDialogOpen: costModelsActions.setCostModelDialog,
    fetchMetrics: metricsActions.fetchMetrics,
    fetchRbac: rbacActions.fetchRbac,
  }
)(CostModelsDetails);
