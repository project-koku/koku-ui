import { Button } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import { ReadOnlyTooltip } from 'routes/costModels/components/readOnlyTooltip';
import { CostModelWizard } from 'routes/costModels/createCostModelWizard';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

const buttonMapStateToProps = (state: RootState) => {
  return {
    canWrite: rbacSelectors.isCostModelWritePermission(state),
  };
};

const buttonMapDispatchToProps = (dispatch: Dispatch) => {
  return {
    openWizard: () => dispatch(costModelsActions.setCostModelDialog({ name: 'createWizard', isOpen: true })),
    closeWizard: () => dispatch(costModelsActions.setCostModelDialog({ name: 'createWizard', isOpen: false })),
  };
};

const buttonMergeProps = (
  stateProps: ReturnType<typeof buttonMapStateToProps>,
  dispatchProps: ReturnType<typeof buttonMapDispatchToProps>,
  ownProps: WrappedComponentProps
) => {
  const { intl = defaultIntl } = ownProps; // Default required for testing
  const { canWrite } = stateProps;
  const { openWizard } = dispatchProps;

  return {
    isDisabled: !canWrite,
    tooltip: intl.formatMessage(messages.costModelsReadOnly),
    children: (
      <Button isDisabled={!canWrite} onClick={openWizard}>
        {intl.formatMessage(messages.costModelsWizardCreateCostModel)}
      </Button>
    ),
  };
};

export const CreateCostModelButton = injectIntl(
  connect(buttonMapStateToProps, buttonMapDispatchToProps, buttonMergeProps)(ReadOnlyTooltip)
);

const wizardMapStateProps = (state: RootState) => {
  return {
    isOpen: costModelsSelectors.isDialogOpen(state)('costmodel').createWizard,
  };
};

const wizardMapDispatchProps = (dispatch: Dispatch) => {
  return {
    openWizard: () => {
      dispatch(costModelsActions.setCostModelDialog({ name: 'createWizard', isOpen: true }));
    },
    closeWizard: () => {
      dispatch(costModelsActions.setCostModelDialog({ name: 'createWizard', isOpen: false }));
    },
  };
};

const wizardMergeProps = (
  stateProps: ReturnType<typeof wizardMapStateProps>,
  dispatchProps: ReturnType<typeof wizardMapDispatchProps>
) => {
  const { isOpen } = stateProps;
  const { openWizard, closeWizard } = dispatchProps;
  return { isOpen, openWizard, closeWizard };
};

export const CreateCostModelWizard = connect(
  wizardMapStateProps,
  wizardMapDispatchProps,
  wizardMergeProps
)(CostModelWizard);
