import { Button, ButtonVariant, FormGroup, Split, SplitItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { Resource } from 'api/resources/resource';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { SelectWrapper, type SelectWrapperOption } from 'routes/components/selectWrapper';
import { RateInput } from 'routes/settings/costModels/components/inputs/rateInput';
import { SimpleInput } from 'routes/settings/costModels/components/inputs/simpleInput';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';

import type { UseRateData } from './useRateForm';
import type { RateFormErrors, RateFormTagValue } from './utils';

interface GpuRatesFormOwnProps {
  currencyUnits?: string;
  errors: Pick<RateFormErrors, 'tagValueValues' | 'tagValues' | 'tagDescription'>;
  gpuModels: Resource;
  removeTag: UseRateData['removeTag'];
  tagValues: RateFormTagValue[];
  updateTag: UseRateData['updateTag'];
}

type GpuRatesFormProps = GpuRatesFormOwnProps & WrappedComponentProps;

const GpuRatesFormBase: React.FC<GpuRatesFormProps> = ({
  currencyUnits,
  errors,
  intl = defaultIntl, // Default required for testing,
  gpuModels,
  tagValues,
  removeTag,
  updateTag,
}) => {
  const style = { minWidth: '150px', whiteSpace: 'nowrap' };

  return (
    <>
      {tagValues.map((tag, ix: number) => {
        return (
          <Split hasGutter key={ix}>
            <SplitItem>
              <FormGroup
                isRequired
                style={style}
                fieldId={`tag-value_${ix}`}
                label={intl.formatMessage(messages.costModelsGpuModel)}
              >
                <SelectWrapper
                  id={`tag-value_${ix}`}
                  onSelect={(_evt, selection: SelectWrapperOption) => updateTag({ tagValue: selection.value }, ix)}
                  options={gpuModels?.data?.map((option: any) => {
                    // Single model selection
                    const duplicateTag = tagValues.find(
                      val => val.tagValue !== tag.tagValue && val.tagValue === option.value
                    );
                    const isDisabled = duplicateTag !== undefined;
                    return {
                      ...(isDisabled && { description: intl.formatMessage(messages.gpuModelDuplicate) }),
                      isDisabled,
                      toString: () => option.value,
                      value: option.value,
                    };
                  })}
                  selection={tag.tagValue}
                />
              </FormGroup>
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
                placeholder={intl.formatMessage(messages.costModelsEnterGpuDesc)}
                value={tag.description}
                onChange={(_evt, value) => updateTag({ description: value }, ix)}
                helperTextInvalid={errors.tagDescription[ix]}
              />
            </SplitItem>
            <SplitItem style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ReadOnlyTooltip defaultMsg={messages.costModelsRemoveGpuLabel}>
                  <Button
                    icon={<MinusCircleIcon />}
                    aria-label={intl.formatMessage(messages.costModelsRemoveGpuLabel)}
                    variant={ButtonVariant.plain}
                    isDisabled={tagValues.length === 1}
                    onClick={() => removeTag(ix)}
                  ></Button>
                </ReadOnlyTooltip>
              </div>
            </SplitItem>
          </Split>
        );
      })}
    </>
  );
};

const GpuRatesForm = injectIntl(GpuRatesFormBase);
export { GpuRatesForm };
