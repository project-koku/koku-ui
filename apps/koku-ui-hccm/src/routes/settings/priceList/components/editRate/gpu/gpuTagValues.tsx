import {
  Button,
  ButtonVariant,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { getQuery } from 'api/queries/query';
import type { TagValue } from 'api/rates';
import { type Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';
import { formatCurrencyRaw, getCurrencySymbol } from 'utils/format';

import { styles } from './gpuTagValues.styes';

interface GpuTagValuesOwnProps {
  currency?: string;
  errors?: any;
  onDelete?: (index) => void;
  onDescriptionChange?: (value, index) => void;
  onRateChange?: (value, index) => void;
  onValueChange?: (value, index) => void;
  tagKey: string;
  tagValues?: TagValue[];
}

export interface GpuTagValuesStateProps {
  resource: Resource;
  resourceError: AxiosError;
  resourceFetchStatus: FetchStatus;
}

export interface GpuTagValuesMapProps {
  tagKey: string;
}

type GpuTagValuesProps = GpuTagValuesOwnProps;

const GpuTagValues: React.FC<GpuTagValuesProps> = ({
  currency,
  errors,
  onDelete,
  onDescriptionChange,
  onRateChange,
  onValueChange,
  tagKey,
  tagValues,
}) => {
  const intl = useIntl();

  const requiredColumnMark = (
    <span aria-hidden className="pf-v6-c-form__label-required">
      &nbsp;{'*'}
    </span>
  );

  // Fetch GPU models
  const { resource, resourceFetchStatus } = useMapToProps({
    tagKey,
  });

  const getModelOptions = (index: number) => {
    if (!resource?.data?.length) {
      return [];
    }
    return resource?.data?.map((option: any) => {
      // Vendor selection must be unique for a given metric/measurement/cost type
      const duplicateTag = tagValues.find((val, valIx) => {
        return valIx !== index && val.tag_value === option.value;
      });
      const isDisabled = duplicateTag !== undefined;
      return {
        ...(isDisabled && { description: intl.formatMessage(messages.gpuModelDuplicate) }),
        isDisabled,
        toString: () => option.value,
        value: option.value,
      };
    });
  };

  return (
    <Table aria-label={intl.formatMessage(messages.costModelsEnterTagRate)} borders={false} variant={'compact'}>
      <Thead noWrap>
        <Tr>
          <Th></Th>
          <Th>
            {intl.formatMessage(messages.costModelsGpuModel)}
            {requiredColumnMark}
          </Th>
          <Th>
            {intl.formatMessage(messages.rate)}
            {requiredColumnMark}
          </Th>
          <Th>{intl.formatMessage(messages.description)}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {tagValues?.map((item, index) => {
          const isOddRow = (index + 1) % 2;
          return (
            <Tr key={`tag-values-${index}`} style={isOddRow ? styles.oddRow : {}}>
              <Td style={styles.vertAlign}>
                <span className="pf-v6-u-font-size-sm">
                  <span className="pf-v6-u-text-break-word">{intl.formatMessage(messages.equalsSymbol)}</span>
                </span>
              </Td>
              <Td dataLabel={intl.formatMessage(messages.costModelsGpuModel)}>
                <SelectWrapper
                  id={`gpu-tag-values-value-${index}`}
                  helperText={errors?.[index]?.tag_value}
                  isInvalid={errors?.[index]?.tag_value}
                  isDisabled={!(resource?.data?.length > 0 && resourceFetchStatus === FetchStatus.complete)}
                  options={getModelOptions(index)}
                  onSelect={(_evt, selection: SelectWrapperOption) => onValueChange(selection.value, index)}
                  placeholder={intl.formatMessage(messages.select)}
                  selection={item.tag_value}
                  status={errors?.[index]?.tag_value ? 'danger' : undefined}
                  toggleAriaLabel={intl.formatMessage(messages.costModelsGpuModel)}
                />
              </Td>
              <Td dataLabel={intl.formatMessage(messages.rate)}>
                <InputGroup>
                  <InputGroupText style={styles.currency}>{getCurrencySymbol(currency)}</InputGroupText>
                  <InputGroupItem isFill>
                    <TextInput
                      aria-label={intl.formatMessage(messages.rate)}
                      isRequired
                      id={`gpu-tag-values-rate-${index}`}
                      onChange={(_evt, value) => onRateChange(value, index)}
                      placeholder={formatCurrencyRaw(0, currency, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      type="text"
                      validated={errors?.[index]?.value ? 'error' : 'default'}
                      value={item.value}
                    />
                  </InputGroupItem>
                </InputGroup>
                {errors?.[index]?.value && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(errors?.[index]?.value)}</HelperTextItem>
                  </HelperText>
                )}
              </Td>
              <Td dataLabel={intl.formatMessage(messages.priceListEnterDescription)}>
                <TextArea
                  aria-label={intl.formatMessage(messages.priceListEnterDescription)}
                  id={`gpu-tag-values-description-${index}`}
                  onChange={(_evt, value) => onDescriptionChange(value, index)}
                  placeholder={intl.formatMessage(messages.priceListEnterDescription)}
                  resizeOrientation="vertical"
                  rows={1}
                  validated={errors?.[index]?.description ? 'error' : 'default'}
                  value={item.description}
                />
                {errors?.[index]?.description && (
                  <HelperText>
                    <HelperTextItem variant="error">{intl.formatMessage(errors[index].description)}</HelperTextItem>
                  </HelperText>
                )}
              </Td>
              <Td>
                <ReadOnlyTooltip defaultMsg={messages.priceListRemoveTag}>
                  <Button
                    aria-label={intl.formatMessage(messages.priceListRemoveTag)}
                    icon={<MinusCircleIcon />}
                    isDisabled={tagValues.length === 1}
                    onClick={() => onDelete(index)}
                    variant={ButtonVariant.plain}
                  ></Button>
                </ReadOnlyTooltip>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

const useMapToProps = ({ tagKey }: GpuTagValuesMapProps): GpuTagValuesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery = {
    limit: 100,
    vendor_name: tagKey,
  };
  const reportQueryString = getQuery(reportQuery);
  const resource = useSelector((state: RootState) =>
    resourceSelectors.selectResource(state, ResourcePathsType.ocp, ResourceType.gpuModel, reportQueryString)
  );
  const resourceFetchStatus = useSelector((state: RootState) =>
    resourceSelectors.selectResourceFetchStatus(state, ResourcePathsType.ocp, ResourceType.gpuModel, reportQueryString)
  );
  const resourceError = useSelector((state: RootState) =>
    resourceSelectors.selectResourceError(state, ResourcePathsType.ocp, ResourceType.gpuModel, reportQueryString)
  );

  useEffect(() => {
    if (!resourceError && resourceFetchStatus !== FetchStatus.inProgress) {
      dispatch(resourceActions.fetchResource(ResourcePathsType.ocp, ResourceType.gpuModel, reportQueryString));
    }
  }, [reportQueryString, resourceError, resourceFetchStatus, ResourcePathsType.ocp, ResourceType.gpuModel]);

  return {
    resource,
    resourceError,
    resourceFetchStatus,
  };
};

export { GpuTagValues };
