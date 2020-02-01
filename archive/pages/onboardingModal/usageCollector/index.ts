import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import UsageCollector from './usageCollector';

export default connect(
  createMapStateToProps(state => ({
    clusterId: onboardingSelectors.selectOnboardingClusterID(state),
    clusterIdValid: onboardingSelectors.selectOnboardingValidation(state)
      .clusterIdValid,
  })),
  {
    updateClusterId: onboardingActions.updateClusterID,
  }
)(translate()(UsageCollector));
