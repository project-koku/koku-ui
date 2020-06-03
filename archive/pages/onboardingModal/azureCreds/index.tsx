import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';

interface Props extends InjectedTranslateProps {
  updateCreds: typeof onboardingActions.updateCreds;
  clientId: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
  tenantId: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
  clientSecret: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
  subscriptionId: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
}

const AzureCredsBase: React.SFC<Props> = ({
  t,
  updateCreds,
  tenantId,
  clientId,
  clientSecret,
  subscriptionId,
}) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        validated={clientId.valid ? 'default' : 'error'}
        fieldId="client-id"
        label={t('onboarding.azure_creds.client_id')}
        helperText={t('onboarding.azure_creds.client_id_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_creds.client_id_helper_text_invalid'
        )}
      >
        <TextInput
          validated={clientId.valid ? 'default' : 'error'}
          id="client-id"
          value={clientId.value}
          onChange={value =>
            updateCreds(
              { name: 'clientId', value },
              currValue => currValue.trim().length > 0
            )
          }
        />
      </FormGroup>
      <FormGroup
        validated={clientSecret.valid ? 'default' : 'error'}
        fieldId="client-secret"
        label={t('onboarding.azure_creds.client_secret')}
        helperText={t('onboarding.azure_creds.client_secret_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_creds.client_secret_helper_text_invalid'
        )}
      >
        <TextInput
          validated={clientSecret.valid ? 'default' : 'error'}
          id="client-secret"
          value={clientSecret.value}
          onChange={value =>
            updateCreds(
              { name: 'clientSecret', value },
              currValue => currValue.trim().length > 0
            )
          }
        />
      </FormGroup>
      <FormGroup
        validated={tenantId.valid ? 'default' : 'error'}
        fieldId="tenant-id"
        label={t('onboarding.azure_creds.tenant_id')}
        helperText={t('onboarding.azure_creds.tenant_id_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_creds.tenant_id_helper_text_invalid'
        )}
      >
        <TextInput
          validated={tenantId.valid ? 'default' : 'error'}
          id="tenant-id"
          value={tenantId.value}
          onChange={value =>
            updateCreds(
              { name: 'tenantId', value },
              currValue => currValue.trim().length > 0
            )
          }
        />
      </FormGroup>
      <FormGroup
        validated={subscriptionId.valid ? 'default' : 'error'}
        fieldId="subscription-id"
        label={t('onboarding.azure_creds.subscription_id')}
        helperText={t('onboarding.azure_creds.subscription_id_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_creds.subscription_id_helper_text_invalid'
        )}
      >
        <TextInput
          validated={subscriptionId.valid ? 'default' : 'error'}
          id="subscription-id"
          value={subscriptionId.value}
          onChange={value =>
            updateCreds(
              { name: 'subscriptionId', value },
              currValue => currValue.trim().length > 0
            )
          }
        />
      </FormGroup>
    </Form>
  );
};

export default connect(
  createMapStateToProps(state => {
    const credsFields = onboardingSelectors.selectAzureCreds(state);
    return {
      clientId: credsFields.clientId,
      tenantId: credsFields.tenantId,
      clientSecret: credsFields.clientSecret,
      subscriptionId: credsFields.subscriptionId,
    };
  }),
  {
    updateCreds: onboardingActions.updateCreds,
  }
)(translate()(AzureCredsBase));
