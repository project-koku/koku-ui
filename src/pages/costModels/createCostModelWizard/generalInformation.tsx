import { FormGroup, Stack, StackItem, TextArea, TextInput, Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import { currencyOptions } from 'pages/components/currency';
import { Form } from 'pages/costModels/components/forms/form';
import { Selector } from 'pages/costModels/components/inputs/selector';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { FeatureType, isFeatureVisible } from 'utils/feature';

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
                <Selector
                  isRequired
                  id="source-type"
                  label={messages.CostModelsSourceType}
                  placeholderText={intl.formatMessage(messages.CostModelsWizardEmptySourceTypeLabel)}
                  value={type}
                  onChange={onTypeChange}
                  options={[
                    {
                      label: messages.CostModelsWizardOnboardAWS,
                      value: 'AWS',
                    },
                    {
                      label: messages.Azure,
                      value: 'Azure',
                    },
                    {
                      label: messages.GCP,
                      value: 'GCP',
                    },
                    {
                      label: messages.CostModelsWizardOnboardOCP,
                      value: 'OCP',
                    },
                  ]}
                />
                {
                  /* Todo: Show in-progress features in beta environment only */
                  isFeatureVisible(FeatureType.currency) && (
                    <Selector
                      label={messages.Currency}
                      direction="up"
                      value={currencyUnits}
                      onChange={onCurrencyChange}
                      id="currency-units"
                      options={currencyOptions.map(o => {
                        return {
                          label: intl.formatMessage(o.label, { units: o.value }),
                          value: o.value,
                        };
                      })}
                    />
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
