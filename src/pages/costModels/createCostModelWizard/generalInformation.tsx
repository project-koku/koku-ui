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
import { currencyOptions } from 'components/currency';
import { Form } from 'components/forms/form';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { isBetaFeature } from 'utils/feature';

import { CostModelContext } from './context';
import { descriptionErrors, nameErrors } from './steps';
import { styles } from './wizard.styles';

interface GeneralInformationOwnProps {
  // TBD...
}

interface GeneralInformationStateProps {
  // TBD...
}

interface GeneralInformationDispatchProps {
  // TBD...
}

type GeneralInformationProps = GeneralInformationOwnProps &
  GeneralInformationStateProps &
  GeneralInformationDispatchProps &
  WrappedComponentProps;

class GeneralInformation extends React.Component<GeneralInformationProps> {
  public render() {
    const { intl } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          currencyUnits,
          dirtyName,
          description,
          name,
          type,
          onCurrencyChange,
          onNameChange,
          onDescChange,
          onTypeChange,
        }) => (
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
                    <FormSelectOption value="Azure" label={intl.formatMessage(messages.Azure)} />
                    <FormSelectOption value="GCP" label={intl.formatMessage(messages.GCP)} />
                    <FormSelectOption value="OCP" label={intl.formatMessage(messages.CostModelsWizardOnboardOCP)} />
                  </FormSelect>
                </FormGroup>
                {
                  /* Todo: Show in-progress features in beta environment only */
                  isBetaFeature() && (
                    <FormGroup label={intl.formatMessage(messages.Currency)} fieldId="currency-units">
                      <FormSelect id="currency-units" value={currencyUnits} onChange={onCurrencyChange}>
                        {currencyOptions.map(option => (
                          <FormSelectOption
                            key={option.value}
                            label={intl.formatMessage(option.label, { units: option.value })}
                            value={option.value}
                          />
                        ))}
                      </FormSelect>
                    </FormGroup>
                  )
                }
              </Form>
            </StackItem>
          </Stack>
        )}
      </CostModelContext.Consumer>
    );
  }
}

const mapStateToProps = createMapStateToProps<GeneralInformationOwnProps, GeneralInformationStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: GeneralInformationDispatchProps = {
  // TDB
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GeneralInformation));
