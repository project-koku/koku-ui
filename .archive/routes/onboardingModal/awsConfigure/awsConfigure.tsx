import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { onboardingActions } from 'store/onboarding';
import { awsS3BucketNameValidator } from 'utils/validators';
import S3BucketForm from './form';
import AwsConfigureInstructions from './instructions';

interface Props extends InjectedTranslateProps {
  s3BucketName: string;
  updateS3BucketName: typeof onboardingActions.updateS3BucketName;
  s3BucketNameValid: boolean;
}

const AwsConfigure: React.SFC<Props> = ({
  t,
  s3BucketName,
  updateS3BucketName,
  s3BucketNameValid,
}) => {
  const onChange = (_name, event: React.FormEvent<HTMLInputElement>) => {
    updateS3BucketName(event.currentTarget.value, awsS3BucketNameValidator);
  };
  return (
    <React.Fragment>
      <AwsConfigureInstructions t={t} />
      <br />
      <br />
      <S3BucketForm
        t={t}
        onChange={onChange}
        isValid={s3BucketNameValid}
        value={s3BucketName}
      />
    </React.Fragment>
  );
};

export default AwsConfigure;
