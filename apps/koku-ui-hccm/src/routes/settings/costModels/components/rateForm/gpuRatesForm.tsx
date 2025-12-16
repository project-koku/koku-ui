import { Button, ButtonVariant, FormGroup, Split, SplitItem } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { type Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { SelectWrapper, type SelectWrapperOption } from 'routes/components/selectWrapper';
import { RateInput } from 'routes/settings/costModels/components/inputs/rateInput';
import { SimpleInput } from 'routes/settings/costModels/components/inputs/simpleInput';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';

import type { UseRateData } from './useRateForm';
import type { RateFormErrors, RateFormTagValue } from './utils';

interface GpuRatesFormOwnProps {
  currencyUnits?: string;
  errors: Pick<RateFormErrors, 'tagValueValues' | 'tagValues' | 'tagDescription'>;
  removeTag: UseRateData['removeTag'];
  tagValues: RateFormTagValue[];
  tagKey: string; // GPU vendor
  updateTag: UseRateData['updateTag'];
}

export interface GpuRatesFormStateProps {
  resource: Resource;
  resourceError: AxiosError;
  resourceFetchStatus: FetchStatus;
}

export interface GpuRatesFormMapProps {
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  tagKey: string; // GPU vendor
}

type GpuRatesFormProps = GpuRatesFormOwnProps & WrappedComponentProps;

const GpuRatesFormBase: React.FC<GpuRatesFormProps> = ({
  currencyUnits,
  errors,
  intl = defaultIntl, // Default required for testing,
  removeTag,
  tagKey,
  tagValues,
  updateTag,
}) => {
  const style = { minWidth: '150px', whiteSpace: 'nowrap' };

  // Fetch GPU models
  const { resource, resourceFetchStatus } = useMapToProps({
    resourcePathsType: ResourcePathsType.ocp,
    resourceType: ResourceType.model,
    tagKey,
  });

  return (
    <>
      {tagValues.map((tag, ix: number) => {
        const hasGpuModel = resource?.data?.length > 0 && resourceFetchStatus === FetchStatus.complete;

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
                  isDisabled={!hasGpuModel}
                  onSelect={(_evt, selection: SelectWrapperOption) => updateTag({ tagValue: selection.value }, ix)}
                  options={resource?.data?.map((option: any) => {
                    // Single model selection
                    const duplicateTag = tagValues.find((val, valIx) => valIx !== ix && val.tagValue === option.value);
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

const useMapToProps = ({ resourcePathsType, resourceType, tagKey }: GpuRatesFormMapProps): GpuRatesFormStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const queryString = `vendor_name=${tagKey}`;
  const resource = useSelector((state: RootState) =>
    resourceSelectors.selectResource(state, resourcePathsType, resourceType, queryString)
  );
  const resourceFetchStatus = useSelector((state: RootState) =>
    resourceSelectors.selectResourceFetchStatus(state, resourcePathsType, resourceType, queryString)
  );
  const resourceError = useSelector((state: RootState) =>
    resourceSelectors.selectResourceError(state, resourcePathsType, resourceType, queryString)
  );

  useEffect(() => {
    if (!resourceError && resourceFetchStatus !== FetchStatus.inProgress && tagKey?.length > 0) {
      dispatch(resourceActions.fetchResource(resourcePathsType, resourceType, queryString));
    }
  }, [queryString, resourceError, resourceFetchStatus, resourcePathsType, resourceType, tagKey]);

  return {
    resource,
    resourceError,
    resourceFetchStatus,
  };
};

const GpuRatesForm = injectIntl(GpuRatesFormBase);
export { GpuRatesForm };
