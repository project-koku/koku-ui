import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { FormGroupProps, TextInputProps } from '@patternfly/react-core';
import { FormGroup, InputGroup, InputGroupText, TextInput } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { formatCurrencyRaw } from 'utils/format';

import { styles } from './rateInput.styles';

interface UniqueProps {
  currencyUnits?: string;
  label?: MessageDescriptor | string;
  helperTextInvalid?: MessageDescriptor | string;
}

type RateFormGroup = Pick<FormGroupProps, 'fieldId' | 'style'>;
type RateTextInput = Pick<TextInputProps, 'value' | 'onChange' | 'validated' | 'onBlur'>;
type RateInputBaseProps = RateFormGroup & RateTextInput & UniqueProps & WrappedComponentProps;

const RateInputBase: React.FC<RateInputBaseProps> = ({
  currencyUnits = 'USD',
  fieldId,
  helperTextInvalid: helpText = messages.priceListPosNumberRate,
  intl = defaultIntl, // Default required for testing
  label = messages.rate,
  onBlur,
  onChange,
  style,
  validated,
  value,
}) => {
  const handleOnKeyDown = event => {
    // Prevent 'enter' and '+'
    if (event.keyCode === 13 || event.keyCode === 187) {
      event.preventDefault();
    }
  };
  return (
    <FormGroup
      isRequired
      style={style}
      fieldId={fieldId}
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : label}
      helperTextInvalid={helpText !== null && typeof helpText === 'object' ? intl.formatMessage(helpText) : helpText}
      validated={validated}
    >
      <InputGroup>
        <InputGroupText style={styles.currency}>
          {intl.formatMessage(messages.currencyUnits, { units: currencyUnits })}
        </InputGroupText>
        <TextInput
          onBlur={onBlur}
          isRequired
          type="text"
          aria-label={intl.formatMessage(messages.costModelsWizardRateAriaLabel)}
          id={fieldId}
          placeholder={formatCurrencyRaw(0, currencyUnits, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          value={value}
          onChange={onChange}
          onKeyDown={handleOnKeyDown}
          validated={validated}
        />
      </InputGroup>
    </FormGroup>
  );
};

const RateInput = injectIntl(RateInputBase);
export { RateInput };
