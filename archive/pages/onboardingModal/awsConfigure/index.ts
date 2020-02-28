import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import AwsConfigure from './awsConfigure';

export default connect(
  createMapStateToProps(state => ({
    s3BucketName: onboardingSelectors.selectOnboardingS3BucketName(state),
    s3BucketNameValid: onboardingSelectors.selectOnboardingValidation(state)
      .s3BucketNameValid,
  })),
  {
    updateS3BucketName: onboardingActions.updateS3BucketName,
  }
)(translate()(AwsConfigure));
