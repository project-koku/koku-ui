import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Button } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import type { RootState } from '../../../../store';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { rbacSelectors } from '../../../../store/rbac';
import { ReadOnlyTooltip } from '../components/readOnlyTooltip';
import { CostModelWizard } from '../costModelWizard';

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
    tooltip: intl.formatMessage(messages.readOnlyPermissions),
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
    isOpen: (costModelsSelectors.isDialogOpen(state)('costmodel') as any).createWizard,
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
