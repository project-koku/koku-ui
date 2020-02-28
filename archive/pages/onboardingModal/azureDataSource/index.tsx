import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';

interface Props extends InjectedTranslateProps {
  updateDataSource: typeof onboardingActions.updateDataSource;
  resourceGroup: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
  storageAccount: {
    value: string;
    valid: boolean;
    dirty: boolean;
  };
}

const AzureAuthBase: React.SFC<Props> = ({
  t,
  updateDataSource,
  resourceGroup,
  storageAccount,
}) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        return false;
      }}
    >
      <FormGroup
        isValid={resourceGroup.valid}
        fieldId="resource-group"
        label={t('onboarding.azure_auth.resource_group')}
        helperText={t('onboarding.azure_auth.resource_group_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_auth.resource_group_helper_text_invalid'
        )}
      >
        <TextInput
          isValid={resourceGroup.valid}
          id="resource-group"
          value={resourceGroup.value}
          onChange={value =>
            updateDataSource(
              { name: 'resourceGroup', value },
              currValue => currValue.trim().length > 0
            )
          }
        />
      </FormGroup>
      <FormGroup
        isValid={storageAccount.valid}
        fieldId="storage-account"
        label={t('onboarding.azure_auth.storage_account')}
        helperText={t('onboarding.azure_auth.storage_account_helper_text')}
        helperTextInvalid={t(
          'onboarding.azure_auth.storage_account_helper_text_invalid'
        )}
      >
        <TextInput
          isValid={storageAccount.valid}
          id="storage-account"
          value={storageAccount.value}
          onChange={value =>
            updateDataSource(
              { name: 'storageAccount', value },
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
    const credsFields = onboardingSelectors.selectAzureAuth(state);
    return {
      resourceGroup: credsFields.resourceGroup,
      storageAccount: credsFields.storageAccount,
    };
  }),
  {
    updateDataSource: onboardingActions.updateDataSource,
  }
)(translate()(AzureAuthBase));
