import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import { WizardBase } from './wizard';

export default connect(
  createMapStateToProps(state => ({
    isModalOpen: onboardingSelectors.selectOnboardingModal(state),
    isInvalid: onboardingSelectors.selectOnboardingIsInvalid(state),
    dirtyMap: onboardingSelectors.selectOnboardingDirty(state),
    sourceKindChecked: onboardingSelectors.selectOnboardingSourceKindChecked(
      state
    ),
    type: onboardingSelectors.selectOnboardingType(state),
  })),
  {
    cancelOnboarding: onboardingActions.cancelOnboarding,
  }
)(translate()(WizardBase));
