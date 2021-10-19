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
import { Currency } from 'api/currency';
import { AxiosError } from 'axios';
import { Form } from 'components/forms/form';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { currencyActions, currencySelectors } from 'store/currency';

import { CostModelContext } from './context';
import { descriptionErrors, nameErrors } from './steps';
import { styles } from './wizard.styles';

interface GeneralInformationOwnProps {
  currency?: Currency;
  currencyError?: AxiosError;
  currencyFetchStatus?: FetchStatus;
}

interface GeneralInformationStateProps {
  currency: Currency;
  currencyError: AxiosError;
  currencyFetchStatus?: FetchStatus;
}

interface GeneralInformationDispatchProps {
  fetchCurrency?: typeof currencyActions.fetchCurrency;
}

type GeneralInformationProps = GeneralInformationOwnProps &
  GeneralInformationStateProps &
  GeneralInformationDispatchProps &
  WrappedComponentProps;

class GeneralInformation extends React.Component<GeneralInformationProps> {
  public componentDidMount() {
    const { fetchCurrency } = this.props;

    fetchCurrency();
  }

  public render() {
    const { currency, intl } = this.props;

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
                  /* Todo: Show new features in beta environment only */
                  insights.chrome.isBeta() && (
                    <FormGroup label={intl.formatMessage(messages.Currency)} fieldId="currency-units">
                      <FormSelect id="currency-units" value={currencyUnits} onChange={onCurrencyChange}>
                        {currency &&
                          currency.data.map(val => (
                            <FormSelectOption
                              key={val.code}
                              label={intl.formatMessage(messages.CurrencyOptions, { units: val.code })}
                              value={val.code}
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

const mapStateToProps = createMapStateToProps<GeneralInformationOwnProps, GeneralInformationStateProps>(state => {
  const currency = currencySelectors.selectCurrency(state);
  const currencyError = currencySelectors.selectCurrencyError(state);
  const currencyFetchStatus = currencySelectors.selectCurrencyFetchStatus(state);

  return {
    currency,
    currencyError,
    currencyFetchStatus,
  };
});

const mapDispatchToProps: GeneralInformationDispatchProps = {
  fetchCurrency: currencyActions.fetchCurrency,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GeneralInformation));
