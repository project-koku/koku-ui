import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import EnableAccountAccess from './enableAccountAccess';

export default connect(
  createMapStateToProps(state => ({
    arn: onboardingSelectors.selectOnboardingArn(state),
    arnValid: onboardingSelectors.selectOnboardingValidation(state).arnValid,
  })),
  {
    updateArn: onboardingActions.updateArn,
  }
)(translate()(EnableAccountAccess));
