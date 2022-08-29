import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingSelectors } from 'store/onboarding';
import Loader from './loader';
import './loader.css';

export default connect(
  createMapStateToProps(state => ({
    name: onboardingSelectors.selectOnboardingName(state),
    type: onboardingSelectors.selectOnboardingType(state),
    clusterId: onboardingSelectors.selectOnboardingClusterID(state),
    arn: onboardingSelectors.selectOnboardingArn(state),
    s3BucketName: onboardingSelectors.selectOnboardingS3BucketName(state),
    azureCreds: onboardingSelectors.selectAzureCreds(state),
    azureAuth: onboardingSelectors.selectAzureAuth(state),
    apiErrors: onboardingSelectors.selectApiErrors(state),
    apiStatus: onboardingSelectors.selectApiStatus(state),
  })),
  {}
)(translate()(Loader));
