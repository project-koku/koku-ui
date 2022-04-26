import { Button, ButtonVariant, Checkbox, FormGroup, Split, SplitItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import { RateInput } from 'pages/costModels/components/inputs/rateInput';
import { SimpleInput } from 'pages/costModels/components/inputs/simpleInput';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { UseRateData } from './useRateForm';
import { RateFormErrors, RateFormTagValue } from './utils';

interface TaggingRatesFormOwnProps {
  currencyUnits?: string;
  defaultTag: UseRateData['taggingRates']['defaultTag'];
  errors: Pick<RateFormErrors, 'tagValueValues' | 'tagValues' | 'tagDescription'>;
  removeTag: UseRateData['removeTag'];
  tagValues: RateFormTagValue[];
  updateDefaultTag: UseRateData['updateDefaultTag'];
  updateTag: UseRateData['updateTag'];
}

type TaggingRatesFormProps = TaggingRatesFormOwnProps & WrappedComponentProps;

const TaggingRatesFormBase: React.FunctionComponent<TaggingRatesFormProps> = ({
  currencyUnits,
  defaultTag,
  errors,
  intl = defaultIntl, // Default required for testing
  tagValues,
  updateDefaultTag,
  removeTag,
  updateTag,
}) => {
  const style = { width: '200px' };
  const elementStyle = {
    height: '100%',
    position: 'relative',
    top: '50%',
  } as React.CSSProperties;
  return (
    <>
      {tagValues.map((tag, ix: number) => {
        return (
          <Split hasGutter key={ix}>
            <SplitItem style={elementStyle}>{intl.formatMessage(messages.EqualsSymbol)}</SplitItem>
            <SplitItem>
              <SimpleInput
                isRequired
                style={style}
                id={`tagValue_${ix}`}
                label={messages.CostModelsTagRateTableValue}
                placeholder={intl.formatMessage(messages.CostModelsEnterTagValue)}
                value={tag.tagValue}
                onChange={value => updateTag({ tagValue: value }, ix)}
                validated={tagValues[ix].isTagValueDirty && errors.tagValueValues[ix] ? 'error' : 'default'}
                helperTextInvalid={errors.tagValueValues[ix]}
              />
            </SplitItem>
            <SplitItem>
              <RateInput
                currencyUnits={currencyUnits}
                fieldId={`rate_${ix}`}
                helperTextInvalid={errors.tagValues[ix]}
                onChange={value => updateTag({ value }, ix)}
                style={style}
                validated={tagValues[ix].isDirty && errors.tagValues[ix] ? 'error' : 'default'}
                value={tag.inputValue}
              />
            </SplitItem>
            <SplitItem>
              <SimpleInput
                style={style}
                id={`desc_${ix}`}
                label={messages.Description}
                validated={errors.tagDescription[ix] ? 'error' : 'default'}
                placeholder={intl.formatMessage(messages.CostModelsEnterTagDescription)}
                value={tag.description}
                onChange={value => updateTag({ description: value }, ix)}
                helperTextInvalid={errors.tagDescription[ix]}
              />
            </SplitItem>
            <SplitItem>
              <FormGroup fieldId={`isDefault_${ix}`} label={intl.formatMessage(messages.CostModelsTagRateTableDefault)}>
                <Checkbox id={`isDefault_${ix}`} isChecked={defaultTag === ix} onChange={() => updateDefaultTag(ix)} />
              </FormGroup>
            </SplitItem>
            <SplitItem>
              <FormGroup fieldId="__irrelevant" label={<div>&nbsp;</div>}>
                <Button
                  aria-label={intl.formatMessage(messages.CostModelsRemoveTagLabel)}
                  variant={ButtonVariant.plain}
                  isDisabled={tagValues.length === 1}
                  onClick={() => removeTag(ix)}
                >
                  <MinusCircleIcon />
                </Button>
              </FormGroup>
            </SplitItem>
          </Split>
        );
      })}
    </>
  );
};

const TaggingRatesForm = injectIntl(TaggingRatesFormBase);
export { TaggingRatesForm };
