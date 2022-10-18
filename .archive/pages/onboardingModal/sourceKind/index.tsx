import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import SourceKind from './sourceKind';

export default connect(
  createMapStateToProps(state => ({
    name: onboardingSelectors.selectOnboardingName(state),
    type: onboardingSelectors.selectOnboardingType(state),
    checked: onboardingSelectors.selectOnboardingSourceKindChecked(state),
    ...onboardingSelectors.selectOnboardingValidation(state),
  })),
  {
    updateName: onboardingActions.updateName,
    updateType: onboardingActions.updateType,
    updateCheck: onboardingActions.updateSourceKindCheckList,
    checkAll: onboardingActions.checkSourceKindCheckList,
  }
)(translate()(SourceKind));
