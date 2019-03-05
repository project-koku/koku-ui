import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingSelectors } from 'store/onboarding';
import IamPolicyInstructions from './instructions';

export default connect(
  createMapStateToProps(state => ({
    s3BucketName: onboardingSelectors.selectOnboardingS3BucketName(state),
  })),
  {}
)(translate()(IamPolicyInstructions));
