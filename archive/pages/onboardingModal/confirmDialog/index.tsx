import { Button, Modal } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';

interface Props extends InjectedTranslateProps {
  onConfirm: typeof onboardingActions.cancelOnboarding;
  onCancel: typeof onboardingActions.hideConfirm;
  isOpen: boolean;
}

const ConfirmDialogBase: React.SFC<Props> = ({
  isOpen,
  onCancel,
  onConfirm,
  t,
}) => (
  <Modal
    isSmall
    title={t('onboarding.confirm.title')}
    onClose={onCancel}
    isOpen={isOpen}
    actions={[
      <Button key="cancel" variant="secondary" onClick={onCancel}>
        {t('onboarding.confirm.cancel')}
      </Button>,
      <Button key="confirm" variant="danger" onClick={onConfirm}>
        {t('onboarding.confirm.close')}
      </Button>,
    ]}
  >
    {t('onboarding.confirm.message')}
  </Modal>
);

export default connect(
  createMapStateToProps(state => ({
    isOpen: onboardingSelectors.selectOnboardingConfirm(state),
  })),
  {
    onCancel: onboardingActions.hideConfirm,
    onConfirm: onboardingActions.cancelOnboarding,
  }
)(translate()(ConfirmDialogBase));
