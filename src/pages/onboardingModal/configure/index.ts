import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingSelectors } from 'store/onboarding';
import ConfigureInstructions from './instructions';

export default connect(
  createMapStateToProps(state => ({
    clusterId: onboardingSelectors.selectOnboardingClusterID(state),
  }))
)(translate()(ConfigureInstructions));
