import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';

interface Props extends InjectedTranslateProps {
  value: string;
  onChange: (_name: any, event: React.FormEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const S3BucketForm: React.SFC<Props> = ({ t, isValid, value, onChange }) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        isValid={isValid}
        fieldId="s3_bucket_name"
        label={t('onboarding.aws_configure.s3_bucket_name_label')}
        helperText={t('onboarding.aws_configure.s3_bucket_name_helper_text')}
        helperTextInvalid={t(
          'onboarding.aws_configure.s3_bucket_name_helper_text_invalid'
        )}
      >
        <TextInput
          {...getTestProps(testIds.onboarding.s3_input)}
          isValid={isValid}
          id="s3_bucket_name"
          value={value}
          onChange={onChange}
        />
      </FormGroup>
    </Form>
  );
};

export default S3BucketForm;
