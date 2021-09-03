import { Button } from '@patternfly/react-core';
import messages from 'locales/messages';
import { ReadOnlyTooltip } from 'pages/costModels/components/readOnlyTooltip';
import { CostModelWizard } from 'pages/costModels/createCostModelWizard';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';
import { intlMock } from 'components/i18n';

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
  const { intl = intlMock } = ownProps;
  const { canWrite } = stateProps;
  const { openWizard } = dispatchProps;

  return {
    isDisabled: !canWrite,
    tooltip: intl.formatMessage(messages.CostModelsReadOnly),
    children: (
      <Button isDisabled={!canWrite} onClick={openWizard}>
        {intl.formatMessage(messages.CostModelsWizardCreateCostModel)}
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
