import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { TextInputProps } from '@patternfly/react-core';
import type { FormGroupProps } from '@patternfly/react-core';
import {
  FormGroup,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { formatCurrencyRaw } from '../../../../../utils/format';
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
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : (label as string)}
    >
      <InputGroup>
        <InputGroupText style={styles.currency}>
          {intl.formatMessage(messages.currencyUnits, { units: currencyUnits })}
        </InputGroupText>
        <InputGroupItem isFill>
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
        </InputGroupItem>
      </InputGroup>
      {validated === 'error' && typeof helpText === 'object' && (
        <HelperText>
          <HelperTextItem variant="error">{intl.formatMessage(helpText)}</HelperTextItem>
        </HelperText>
      )}
    </FormGroup>
  );
};

const RateInput = injectIntl(RateInputBase);
export { RateInput };
