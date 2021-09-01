import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { Form } from 'components/forms/form';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { CostModelContext } from './context';
import { descriptionErrors, nameErrors } from './steps';
import { styles } from './wizard.styles';

const GeneralInformation: React.SFC<WrappedComponentProps> = ({ intl }) => {
  return (
    <CostModelContext.Consumer>
      {({ name, dirtyName, description, type, onNameChange, onDescChange, onTypeChange }) => (
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" size={TitleSizes.xl}>
              {intl.formatMessage(messages.CostModelsWizardGeneralInfoTitle)}
            </Title>
          </StackItem>
          <StackItem>
            <a href={intl.formatMessage(messages.DocsConfigCostModels)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.LearnMore)}
            </a>
          </StackItem>
          <StackItem>
            <Form style={styles.form}>
              <FormGroup
                helperTextInvalid={nameErrors(name)}
                validated={nameErrors(name) === null || !dirtyName ? 'default' : 'error'}
                label={intl.formatMessage(messages.Names, { count: 1 })}
                isRequired
                fieldId="name"
              >
                <TextInput
                  validated={nameErrors(name) === null || !dirtyName ? 'default' : 'error'}
                  isRequired
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onNameChange}
                />
              </FormGroup>
              <FormGroup
                helperTextInvalid={descriptionErrors(description)}
                validated={descriptionErrors(description) === null ? 'default' : 'error'}
                label={intl.formatMessage(messages.Description)}
                fieldId="description"
              >
                <TextArea
                  style={styles.textArea}
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  validated={descriptionErrors(description) === null ? 'default' : 'error'}
                  onChange={onDescChange}
                />
              </FormGroup>
              <FormGroup label={intl.formatMessage(messages.CostModelsSourceType)} isRequired fieldId="source-type">
                <FormSelect id="source-type" value={type} onChange={onTypeChange}>
                  <FormSelectOption
                    value=""
                    label={intl.formatMessage(messages.CostModelsWizardEmptySourceTypeLabel)}
                  />
                  <FormSelectOption value="AWS" label={intl.formatMessage(messages.CostModelsWizardOnboardAWS)} />
                  <FormSelectOption value="AZURE" label={intl.formatMessage(messages.Azure)} />
                  <FormSelectOption value="GCP" label={intl.formatMessage(messages.GCP)} />
                  <FormSelectOption value="OCP" label={intl.formatMessage(messages.CostModelsWizardOnboardOCP)} />
                </FormSelect>
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      )}
    </CostModelContext.Consumer>
  );
};

export default injectIntl(GeneralInformation);
