import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Checkbox, FormGroup, Split, SplitItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { RateInput } from '../inputs/rateInput';
import { SimpleInput } from '../inputs/simpleInput';
import { ReadOnlyTooltip } from '../readOnlyTooltip';
import type { UseRateData } from './useRateForm';
import type { RateFormErrors, RateFormTagValue } from './utils';

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

const TaggingRatesFormBase: React.FC<TaggingRatesFormProps> = ({
  currencyUnits,
  defaultTag,
  errors,
  intl = defaultIntl, // Default required for testing
  tagValues,
  updateDefaultTag,
  removeTag,
  updateTag,
}) => {
  const style = { minWidth: '200px', whiteSpace: 'nowrap' };
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
            <SplitItem style={elementStyle}>{intl.formatMessage(messages.equalsSymbol)}</SplitItem>
            <SplitItem>
              <SimpleInput
                isRequired
                style={style}
                id={`tagValue_${ix}`}
                label={messages.costModelsTagRateTableValue}
                placeholder={intl.formatMessage(messages.costModelsEnterTagValue)}
                value={tag.tagValue}
                onChange={(_evt, value) => updateTag({ tagValue: value }, ix)}
                validated={tagValues[ix].isTagValueDirty && errors.tagValueValues[ix] ? 'error' : 'default'}
                helperTextInvalid={errors.tagValueValues[ix]}
              />
            </SplitItem>
            <SplitItem>
              <RateInput
                currencyUnits={currencyUnits}
                fieldId={`rate_${ix}`}
                helperTextInvalid={errors.tagValues[ix]}
                onChange={(_evt, value) => updateTag({ value }, ix)}
                style={style}
                validated={tagValues[ix].isDirty && errors.tagValues[ix] ? 'error' : 'default'}
                value={tag.value}
              />
            </SplitItem>
            <SplitItem>
              <SimpleInput
                style={style}
                id={`desc_${ix}`}
                label={messages.description}
                validated={errors.tagDescription[ix] ? 'error' : 'default'}
                placeholder={intl.formatMessage(messages.costModelsEnterTagDesc)}
                value={tag.description}
                onChange={(_evt, value) => updateTag({ description: value }, ix)}
                helperTextInvalid={errors.tagDescription[ix]}
              />
            </SplitItem>
            <SplitItem>
              <FormGroup fieldId={`isDefault_${ix}`} label={intl.formatMessage(messages.default)}>
                <Checkbox id={`isDefault_${ix}`} isChecked={defaultTag === ix} onChange={() => updateDefaultTag(ix)} />
              </FormGroup>
            </SplitItem>
            <SplitItem>
              <FormGroup fieldId="__irrelevant" label={<div>&nbsp;</div>}>
                <ReadOnlyTooltip defaultMsg={messages.costModelsRemoveTagLabel}>
                  <Button
                    icon={<MinusCircleIcon />}
                    aria-label={intl.formatMessage(messages.costModelsRemoveTagLabel)}
                    variant={ButtonVariant.plain}
                    isDisabled={tagValues.length === 1}
                    onClick={() => removeTag(ix)}
                  ></Button>
                </ReadOnlyTooltip>
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
