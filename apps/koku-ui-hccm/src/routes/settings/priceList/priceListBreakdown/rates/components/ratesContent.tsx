import {
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import type { MetricHash } from 'api/metrics';
import type { PriceListData } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Rate } from 'api/rates';
import type { Resource } from 'api/resources/resource';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Selector, SimpleInput } from 'routes/settings/components';
import { RateInput, SimpleArea } from 'routes/settings/components';
import {
  getDefaultCostType,
  hasDirtyTagValues,
  hasInvalidTagValues,
  hasTagValuesErrors,
  validateDescription,
  validateName,
  validateRate,
  validateTagKey,
  validateTagKeyDuplicate,
  validateTagValue,
} from 'routes/settings/priceList/priceListBreakdown/rates/components/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { metricsActions, metricsSelectors } from 'store/metrics';
import { resourceActions, resourceSelectors } from 'store/resources';
import { unitsLookupKey } from 'utils/format';

import { GpuTagKey } from './gpu/gpuTagKey';
import { GpuTagValues } from './gpu/gpuTagValues';
import { styles } from './ratesContent.styles';
import { TagValues } from './tag/tagValues';
import type { TagValueExt, TagValueRowErrors, TieredRateExt } from './utils';

interface RatesContentOwnProps {
  isAddRate?: boolean;
  onDisabled?: (value: boolean) => void;
  onSave?: (rates: Rate[]) => void;
  priceList: PriceListData;
  rateIndex?: number;
}

interface RatesContentStateProps {
  metricsHash: MetricHash;
  metricsHashByName: MetricHash;
  metricsHashStatus: FetchStatus;
  resource: Resource;
  resourceError: AxiosError;
  resourceFetchStatus: FetchStatus;
}

export interface RatesContentHandle {
  // Builds the rate from form state and invokes onSave
  save: () => void;
}

type RatesContentProps = RatesContentOwnProps;

const RatesContent = forwardRef<RatesContentHandle, RatesContentProps>(
  ({ isAddRate, onDisabled, onSave, priceList, rateIndex }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `save()` — updated in layout effect (not during render). */
    const saveHandlerRef = useRef<() => void>(() => {});

    const { metricsHash, metricsHashByName, resource, resourceFetchStatus } = useMapToProps();

    // Todo: Replace with label_metric when available in price-lists API
    const rate = priceList?.rates?.[rateIndex];
    const metricName = rate?.metric?.name ?? undefined;
    const labelMetric = rate?.metric?.label_metric ?? undefined;

    // Defaults
    const defaultCostType = metricsHash?.[metricName]?.default_cost_type ?? '';
    const defaultCurrency = priceList?.currency ?? 'USD';
    const defaultTagValue = { default: false, description: '', unit: defaultCurrency };

    const initialTagValues = rate?.tag_rates?.tag_values?.map(tagValue => ({
      ...tagValue,
      valueInput: tagValue?.value?.toString() ?? '',
    })) ?? [defaultTagValue];
    const initialTieredRates =
      rate?.tiered_rates?.map(tieredRate => ({
        ...tieredRate,
        valueInput: tieredRate?.value?.toString() ?? '',
      })) ?? undefined;

    // State management
    const [costType, setCostType] = useState<string>((rate?.cost_type ?? defaultCostType) as string);
    const [costTypeBaseline] = useState<string>((rate?.cost_type ?? defaultCostType) as string);
    const [currency] = useState<string>(defaultCurrency);
    const [description, setDescription] = useState<string>(rate?.description ?? '');
    const [descriptionBaseline] = useState<string>(rate?.description ?? '');
    const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
    const [gpuTagKey, setGpuTagKey] = useState<string>(rate?.tag_rates?.tag_key ?? '');
    const [gpuTagKeyBaseline] = useState<string>(rate?.tag_rates?.tag_key ?? '');
    const [gpuTagKeyError, setGpuTagKeyError] = useState<MessageDescriptor>();
    const [gpuTagValues, setGpuTagValues] = useState<TagValueExt[]>(cloneDeep(initialTagValues));
    const [gpuTagValuesBaseline] = useState<TagValueExt[]>(cloneDeep(initialTagValues));
    const [gpuTagValuesErrors, setGpuTagValuesErrors] = useState<TagValueRowErrors[]>(
      initialTagValues?.map(() => ({})) ?? []
    );
    const [isSubmitModeGpuValues, setIsSubmitModeGpuValues] = useState<boolean>(false);
    const [isSubmitModeTagValues, setIsSubmitModeTagValues] = useState<boolean>(false);
    const [isSubmitModeTieredValue, setIsSubmitModeTieredValue] = useState<boolean>(false);
    const [isTagRatesChecked, setIsTagRatesChecked] = useState<boolean>(false);
    const [isTagRatesDisabled, setIsTagRatesDisabled] = useState<boolean>(false);
    const [measurement, setMeasurement] = useState<string>(metricName ?? '');
    const [measurementBaseline] = useState<string>(metricName ?? '');
    const [metric, setMetric] = useState<string>(labelMetric ?? '');
    const [metricBaseline] = useState<string>(labelMetric ?? '');
    const [name, setName] = useState<string>(rate?.custom_name ?? '');
    const [nameBaseline] = useState<string>(rate?.custom_name ?? '');
    const [nameError, setNameError] = useState<MessageDescriptor>();
    const [tagKey, setTagKey] = useState<string>(rate?.tag_rates?.tag_key ?? '');
    const [tagKeyBaseline] = useState<string>(rate?.tag_rates?.tag_key ?? '');
    const [tagKeyError, setTagKeyError] = useState<MessageDescriptor>();
    const [tagValues, setTagValues] = useState<TagValueExt[]>(cloneDeep(initialTagValues));
    const [tagValuesBaseline] = useState<TagValueExt[]>(cloneDeep(initialTagValues));
    const [tagValuesErrors, setTagValuesErrors] = useState<TagValueRowErrors[]>(
      initialTagValues?.map(() => ({})) ?? []
    );
    const [tieredRateValue, setTieredRateValue] = useState<TieredRateExt>(initialTieredRates?.[0] ?? undefined);
    const [tieredRateValueBaseline] = useState<TieredRateExt>(initialTieredRates?.[0] ?? undefined);
    const [tieredRateValueError, setTieredRateValueError] = useState<MessageDescriptor>();

    // Dirty checks
    const isCostTypeDirty = costType !== costTypeBaseline;
    const isDescriptionDirty = description !== descriptionBaseline;
    const isGpuTagKeyDirty = gpuTagKey !== gpuTagKeyBaseline;
    const isGpuTagValuesDirty = hasDirtyTagValues(gpuTagValues, gpuTagValuesBaseline);
    const isMeasurementDirty = measurement !== measurementBaseline;
    const isMetricDirty = metric !== metricBaseline;
    const isNameDirty = name !== nameBaseline;
    const isTagKeyDirty = tagKey !== tagKeyBaseline;
    const isTagValuesDirty = hasDirtyTagValues(tagValues, tagValuesBaseline);
    const isTieredRateValueDirty = tieredRateValue?.value !== tieredRateValueBaseline?.value;

    // Validation checks

    const isDescriptionInvalid = (!description && isDescriptionDirty) || descriptionError !== undefined;
    const isGpuTagKeyInvalid = (!gpuTagKey && isGpuTagKeyDirty) || gpuTagKeyError !== undefined;
    const isGpuTagValuesInvalid =
      isSubmitModeGpuValues &&
      isGpuTagValuesDirty &&
      (hasInvalidTagValues(gpuTagValues) !== undefined || hasTagValuesErrors(gpuTagValuesErrors));
    const isNameInvalid = (!name && isNameDirty) || nameError !== undefined;
    const isMeasurementInvalid = !measurement && isMeasurementDirty;
    const isTagKeyInvalid = (!tagKey && isTagKeyDirty) || tagKeyError !== undefined;
    const isTagValuesInvalid =
      isSubmitModeTagValues &&
      isTagValuesDirty &&
      (hasInvalidTagValues(tagValues) !== undefined || hasTagValuesErrors(tagValuesErrors));
    const isTieredRateValueInvalid =
      isSubmitModeTieredValue &&
      isTieredRateValueDirty &&
      (tieredRateValue === undefined || tieredRateValue?.value < 0 || tieredRateValueError !== undefined);

    // Unsaved changes checks
    const hasAddRateChanges =
      isCostTypeDirty &&
      isMeasurementDirty &&
      isMetricDirty &&
      isNameDirty &&
      ((isSubmitModeGpuValues && isGpuTagKeyDirty && isGpuTagValuesDirty) ||
        (isSubmitModeTagValues && isTagKeyDirty && isTagValuesDirty) ||
        (isSubmitModeTieredValue && isTieredRateValueDirty));

    const hasEditRateChanges =
      isCostTypeDirty ||
      isDescriptionDirty ||
      isMeasurementDirty ||
      isMetricDirty ||
      isNameDirty ||
      (isSubmitModeGpuValues && (isGpuTagKeyDirty || isGpuTagValuesDirty)) ||
      (isSubmitModeTagValues && (isTagKeyDirty || isTagValuesDirty)) ||
      (isSubmitModeTieredValue && isTieredRateValueDirty);

    const hasUnsavedChanges = isAddRate ? hasAddRateChanges : hasEditRateChanges;

    const isDisabled =
      !hasUnsavedChanges ||
      isDescriptionInvalid ||
      isGpuTagKeyInvalid ||
      isGpuTagValuesInvalid ||
      isNameInvalid ||
      isMeasurementInvalid ||
      isTagKeyInvalid ||
      isTagValuesInvalid ||
      isTieredRateValueInvalid;

    // Cost type options and select

    const getCostTypeOptions = (): SelectWrapperOption[] => {
      return [
        {
          toString: () => intl.formatMessage(messages.infrastructure),
          value: 'Infrastructure',
        },
        {
          toString: () => intl.formatMessage(messages.supplementary),
          value: 'Supplementary',
        },
      ];
    };

    // Metric options and select

    const getMetricLabel = m => {
      // Match message descriptor or default to API string
      const value = m?.replace(/ /g, '_').toLowerCase();
      return intl.formatMessage(messages.metricValues, { value }) || m;
    };

    const metricOptions: SelectWrapperOption[] = React.useMemo(() => {
      const hasGpuVendor = resource?.data?.length > 0 && resourceFetchStatus === FetchStatus.complete;
      if (!metricsHash) {
        return [];
      }
      return Object.keys(metricsHash)
        ?.map(m => ({
          isDisabled: m?.toLowerCase() === 'gpu' && !hasGpuVendor,
          toString: () => getMetricLabel(m),
          value: m,
        }))
        .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));
    }, [metricsHash]);

    // Measurement options and select

    const getMeasurementDescription = (o, u) => {
      // Match message descriptor or default to API string
      const units = intl.formatMessage(messages.units, { units: unitsLookupKey(u) }) || u;
      const desc = intl.formatMessage(messages.measurementValuesDesc, {
        value: o?.toLowerCase().replace('-', '_'),
        units: units ? units : u,
      });
      return desc ? desc : o;
    };

    const getMeasurementLabel = (m, u) => {
      // Match message descriptor or default to API string
      const units = intl.formatMessage(messages.units, { units: unitsLookupKey(u) }) || u;
      const value = m?.toLowerCase().replace('-', '_');
      return intl.formatMessage(messages.measurementValues, { value, units, count: 2 }) || m;
    };

    const measurementOptions: SelectWrapperOption[] = React.useMemo(() => {
      if (!metricOptions.find(m => m.value === metric)) {
        return [];
      }
      return Object.keys(metricsHash?.[metric])
        ?.map(opt => {
          const m = metricsHash[metric][opt];
          const unit = m?.label_measurement_unit;
          return {
            description: getMeasurementDescription(m?.label_measurement, unit),
            isDisabled: false,
            toString: () => getMeasurementLabel(m?.label_measurement, unit),
            value: m?.metric,
          };
        })
        .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));
    }, [metricOptions, metric]);

    // Handlers

    const handleOnDescriptionChange = (value: string) => {
      setDescription(value);

      const error = validateDescription(value);
      if (error) {
        setDescriptionError(error);
      } else {
        setDescriptionError(undefined);
      }
    };

    const handleOnGpuTagKeyChange = (value: string) => {
      setGpuTagKey(value);

      const error = validateTagKey(value, true);
      const duplicateTagKeyError =
        value !== gpuTagKeyBaseline
          ? validateTagKeyDuplicate(
              {
                costType,
                measurement,
                metric,
                tagKey: value,
              },
              priceList?.rates,
              metricsHashByName
            )
          : undefined;
      if (error || duplicateTagKeyError) {
        setGpuTagKeyError(error || duplicateTagKeyError);
      } else {
        setGpuTagKeyError(undefined);
      }
    };

    const handleOnGpuTagValuesAdd = () => {
      setGpuTagValues([...(gpuTagValues ?? []), { default: false, description: '', unit: currency }]);
      setGpuTagValuesErrors(prev => [...prev, {}]);
    };

    const handleOnGpuTagValuesDelete = (indexToRemove: number) => {
      setGpuTagValues([...(gpuTagValues?.filter((_t, index) => index !== indexToRemove) ?? [])]);
      setGpuTagValuesErrors([...(gpuTagValuesErrors?.filter((_t, index) => index !== indexToRemove) ?? [])]);
    };

    const handleOnGpuTagValuesDescriptionChange = (value: string, index: number) => {
      const newTagValues = cloneDeep(gpuTagValues ?? []);
      newTagValues[index].description = value;
      setGpuTagValues(newTagValues);
      updateGpuTagValuesErrors('description', validateDescription(value), index);
    };

    const handleOnGpuTagValuesRateChange = (value: string, index: number) => {
      const error = validateRate(value);
      updateGpuTagValuesErrors('value', error, index);

      const newTagValues = cloneDeep(gpuTagValues ?? []);
      newTagValues[index].valueInput = value;
      newTagValues[index].value = error ? undefined : Number(value);
      setGpuTagValues(newTagValues);
    };

    const handleOnGpuTagValuesValueChange = (value: string, index: number) => {
      const newTagValues = cloneDeep(gpuTagValues ?? []);
      newTagValues[index].tag_value = value;
      setGpuTagValues(newTagValues);

      const error = validateTagKey(value, true) || validateTagValue(value, gpuTagValues, index);
      updateGpuTagValuesErrors('tag_value', error, index);
    };

    const handleOnMeasurementSelect = (value: string) => {
      setMeasurement(value);

      const duplicateTagKeyError = validateTagKeyDuplicate(
        {
          costType,
          measurement: value,
          metric,
          tagKey,
        },
        priceList?.rates,
        metricsHashByName
      );
      if (duplicateTagKeyError) {
        setTagKeyError(duplicateTagKeyError);
      } else {
        setTagKeyError(undefined);
      }
    };

    const handleOnMetricSelect = (value: string) => {
      setCostType(getDefaultCostType(metricsHash, value));
      setMeasurement(undefined);
      setMetric(value);
      updateSubmitMode(value, false);
    };

    const handleOnNameChange = (value: string) => {
      setName(value);

      const error = validateName(value, priceList?.rates ?? [], rateIndex);
      if (error) {
        setNameError(error);
      } else {
        setNameError(undefined);
      }
    };

    const handleOnSave = () => {
      let values = {};
      if (isSubmitModeGpuValues) {
        values = {
          tag_rates: {
            tag_key: gpuTagKey,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tag_values: gpuTagValues.map(({ valueInput, ...rest }) => ({ ...rest, unit: currency })),
          },
        };
      } else if (isSubmitModeTagValues) {
        values = {
          tag_rates: {
            tag_key: tagKey,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            tag_values: tagValues.map(({ valueInput, ...rest }) => ({ ...rest, unit: currency })),
          },
        };
      } else if (isSubmitModeTieredValue) {
        values = {
          tiered_rates: [
            {
              unit: currency,
              value: tieredRateValue?.value ?? undefined,
            },
          ],
        };
      }

      const newRate = {
        ...rate,
        cost_type: costType,
        custom_name: name,
        description,
        metric: {
          name: measurement,
        },
        ...values,
      };

      const existingRates: any = [...(priceList?.rates ?? [])];
      let newRates;

      if (isAddRate) {
        newRates = [...existingRates, newRate];
      } else {
        newRates = [...existingRates];
        newRates[rateIndex] = newRate;
      }
      onSave?.(newRates);
    };

    const handleOnTagKeyChange = (value: string) => {
      setTagKey(value);

      const error = validateTagKey(value, false);
      const duplicateTagKeyError =
        value !== tagKeyBaseline
          ? validateTagKeyDuplicate(
              {
                costType,
                measurement,
                metric,
                tagKey: value,
              },
              priceList?.rates,
              metricsHashByName
            )
          : undefined;
      if (error || duplicateTagKeyError) {
        setTagKeyError(error || duplicateTagKeyError);
      } else {
        setTagKeyError(undefined);
      }
    };

    const handleOnTagRatesChange = (checked: boolean) => {
      updateSubmitMode(metric, checked);
    };

    const handleOnTagValuesAdd = () => {
      setTagValues([...(tagValues ?? []), { default: false, description: '', unit: currency }]);
      setTagValuesErrors(prev => [...prev, {}]);
    };

    const handleOnTagValuesDefaultChange = (value: boolean, indexToChange: number) => {
      const newTagValues = (tagValues ?? []).map((tagValue, index) => ({
        ...tagValue,
        default: index === indexToChange ? value : false,
      }));
      setTagValues(newTagValues);
    };

    const handleOnTagValuesDelete = (indexToRemove: number) => {
      setTagValues([...(tagValues?.filter((_t, index) => index !== indexToRemove) ?? [])]);
      setTagValuesErrors([...(tagValuesErrors?.filter((_t, index) => index !== indexToRemove) ?? [])]);
    };

    const handleOnTagValuesDescriptionChange = (value: string, index: number) => {
      const newTagValues = cloneDeep(tagValues ?? []);
      newTagValues[index].description = value;
      setTagValues(newTagValues);
      updateTagValuesErrors('description', validateDescription(value), index);
    };

    const handleOnTagValuesRateChange = (value: string, index: number) => {
      const error = validateRate(value);
      updateTagValuesErrors('value', error, index);

      const newTagValues = cloneDeep(tagValues ?? []);
      newTagValues[index].valueInput = value;
      newTagValues[index].value = error ? undefined : Number(value);
      setTagValues(newTagValues);
    };

    const handleOnTagValuesValueChange = (value: string, index: number) => {
      const newTagValues = cloneDeep(tagValues ?? []);
      newTagValues[index].tag_value = value;
      setTagValues(newTagValues);

      const error = validateTagKey(value, isSubmitModeGpuValues) || validateTagValue(value, tagValues, index);
      updateTagValuesErrors('tag_value', error, index);
    };

    const handleOnTieredRateValueChange = (value: string) => {
      const error = validateRate(value);
      setTieredRateValueError(error || undefined);
      setTieredRateValue({ value: error ? undefined : Number(value), valueInput: value });
    };

    // Update functions

    const updateGpuTagValuesErrors = (
      key: keyof TagValueRowErrors,
      error: MessageDescriptor | null | undefined,
      index: number
    ) => {
      setGpuTagValuesErrors(prev => {
        const next = cloneDeep(prev.length ? prev : []);
        const minLength = index + 1;
        while (next.length < minLength) {
          next.push({});
        }
        const row = { ...(next[index] ?? {}) };
        if (error) {
          row[key] = error;
        } else {
          delete row[key];
        }
        next[index] = row;
        return next;
      });
    };

    const updateSubmitMode = (value: string, checked: boolean) => {
      const metricKey = value?.toLowerCase() ?? '';

      if (metricKey === 'cluster') {
        setIsSubmitModeGpuValues(false);
        setIsSubmitModeTagValues(false);
        setIsSubmitModeTieredValue(true);
        setIsTagRatesChecked(false);
        setIsTagRatesDisabled(true);
      } else if (metricKey === 'gpu') {
        setIsSubmitModeGpuValues(true);
        setIsSubmitModeTagValues(false);
        setIsSubmitModeTieredValue(false);
        setIsTagRatesChecked(false);
        setIsTagRatesDisabled(false);
      } else if (metricKey === 'project') {
        setIsSubmitModeGpuValues(false);
        setIsSubmitModeTagValues(true);
        setIsSubmitModeTieredValue(false);
        setIsTagRatesChecked(true);
        setIsTagRatesDisabled(true);
      } else {
        setIsSubmitModeGpuValues(false);
        setIsSubmitModeTagValues(checked);
        setIsSubmitModeTieredValue(!checked);
        setIsTagRatesChecked(checked);
        setIsTagRatesDisabled(false);
      }
    };

    const updateTagValuesErrors = (
      key: keyof TagValueRowErrors,
      error: MessageDescriptor | null | undefined,
      index: number
    ) => {
      setTagValuesErrors(prev => {
        const next = cloneDeep(prev.length ? prev : []);
        const minLength = index + 1;
        while (next.length < minLength) {
          next.push({});
        }
        const row = { ...(next[index] ?? {}) };
        if (error) {
          row[key] = error;
        } else {
          delete row[key];
        }
        next[index] = row;
        return next;
      });
    };

    // Effects

    useEffect(() => {
      updateSubmitMode(metric || labelMetric, rate?.tag_rates?.tag_key !== undefined);
    }, [priceList, rateIndex]);

    useEffect(() => {
      onDisabled?.(isDisabled);
    }, [isDisabled]);

    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          saveHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      saveHandlerRef.current = handleOnSave;
    });

    return (
      <Form onSubmit={event => event.preventDefault()}>
        <Stack hasGutter>
          <StackItem>
            <SimpleInput
              helperTextInvalid={nameError}
              id="name"
              isRequired
              label={intl.formatMessage(messages.names, { count: 1 })}
              onChange={(_evt, value) => handleOnNameChange(value)}
              validated={nameError ? 'error' : 'default'}
              value={name}
            />
          </StackItem>
          <StackItem>
            <SimpleArea
              helperTextInvalid={descriptionError}
              id="description"
              label={intl.formatMessage(messages.descriptionOptional)}
              onChange={(_evt, value) => handleOnDescriptionChange(value)}
              validated={descriptionError ? 'error' : 'default'}
              value={description}
            />
          </StackItem>
          <StackItem>
            <Split hasGutter style={styles.splitRowAlignFields}>
              <SplitItem style={styles.splitItem}>
                <Selector
                  id="metric"
                  isRequired
                  label={intl.formatMessage(messages.metric)}
                  options={metricOptions}
                  onSelect={(_evt, value) => handleOnMetricSelect(value)}
                  placeholderText={intl.formatMessage(messages.select)}
                  toggleAriaLabel={intl.formatMessage(messages.priceListSelectMetric)}
                  value={metric}
                />
              </SplitItem>
              <SplitItem style={styles.splitItem}>
                <Selector
                  helperTextInvalid={intl.formatMessage(messages.requiredField)}
                  id="measurement"
                  isDisabled={measurementOptions?.length === 0}
                  isInvalid={isMeasurementInvalid}
                  isRequired
                  label={intl.formatMessage(messages.measurement)}
                  options={measurementOptions}
                  onSelect={(_evt, value) => handleOnMeasurementSelect(value)}
                  placeholderText={intl.formatMessage(messages.select)}
                  toggleAriaLabel={intl.formatMessage(messages.priceListSelectMetric)}
                  value={measurement}
                />
              </SplitItem>
              <SplitItem style={styles.splitItem}>
                <Selector
                  id="cost-type"
                  label={intl.formatMessage(messages.calculationType)}
                  options={getCostTypeOptions()}
                  onSelect={(_evt, value) => setCostType(value)}
                  placeholderText={intl.formatMessage(messages.select)}
                  toggleAriaLabel={intl.formatMessage(messages.priceListSelectCostType)}
                  value={costType}
                />
              </SplitItem>
              <SplitItem style={styles.splitItem}>
                {isSubmitModeTieredValue ? (
                  <RateInput
                    currencyUnits={currency}
                    fieldId="tiered-rate"
                    helperTextInvalid={tieredRateValueError}
                    onChange={(_evt, value) => handleOnTieredRateValueChange(value)}
                    validated={tieredRateValueError ? 'error' : 'default'}
                    value={tieredRateValue?.valueInput ?? ''}
                  />
                ) : (
                  <FormGroup fieldId="tiered-rate" label={intl.formatMessage(messages.rate)}>
                    <EmptyValueState />
                  </FormGroup>
                )}
              </SplitItem>
              <SplitItem style={styles.splitItemTagKeyColumn}>
                {isSubmitModeGpuValues && (
                  <GpuTagKey
                    costType={costType}
                    error={gpuTagKeyError}
                    invalid={!!gpuTagKeyError}
                    metric={metric}
                    measurement={measurement}
                    metricsHashByName={metricsHashByName}
                    onChange={handleOnGpuTagKeyChange}
                    rates={priceList?.rates}
                    tagKey={gpuTagKey}
                  />
                )}
                {(isSubmitModeTagValues || isSubmitModeTieredValue) && (
                  <FormGroup
                    fieldId="tag-key"
                    isRequired={isTagRatesChecked}
                    label={intl.formatMessage(messages.costModelsEnterTagRate)}
                  >
                    <Split hasGutter style={styles.splitSwitchAndTagKey}>
                      <SplitItem style={styles.splitItemSwitchOnly}>
                        <Switch
                          aria-label={intl.formatMessage(messages.costModelsEnterTagRate)}
                          isChecked={isTagRatesChecked}
                          isDisabled={isTagRatesDisabled}
                          onChange={(_event, checked) => handleOnTagRatesChange(checked)}
                        />
                      </SplitItem>
                      {isTagRatesChecked && (
                        <SplitItem style={styles.splitItemTagKeyInput}>
                          <TextInput
                            id="tag-key"
                            isRequired
                            onChange={(_evt, value) => handleOnTagKeyChange(value)}
                            placeholder={intl.formatMessage(messages.priceListEnterTagKey)}
                            style={styles.tagKeyTextInput}
                            validated={tagKeyError ? 'error' : 'default'}
                            value={tagKey}
                          />
                          {tagKeyError && (
                            <HelperText>
                              <HelperTextItem variant="error">{intl.formatMessage(tagKeyError)}</HelperTextItem>
                            </HelperText>
                          )}
                        </SplitItem>
                      )}
                    </Split>
                  </FormGroup>
                )}
              </SplitItem>
            </Split>
          </StackItem>
          {isSubmitModeGpuValues && (
            <>
              <StackItem>
                <Alert isInline isPlain title={intl.formatMessage(messages.costModelsGpuDesc)} variant="info">
                  <a href={intl.formatMessage(messages.docsCostModelsGpu)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.costModelsGpuLearnMore)}
                  </a>
                </Alert>
              </StackItem>
              <StackItem>
                <GpuTagValues
                  currency={currency}
                  errors={gpuTagValuesErrors}
                  onDelete={handleOnGpuTagValuesDelete}
                  onDescriptionChange={handleOnGpuTagValuesDescriptionChange}
                  onRateChange={handleOnGpuTagValuesRateChange}
                  onValueChange={handleOnGpuTagValuesValueChange}
                  tagKey={gpuTagKey}
                  tagValues={gpuTagValues}
                />
              </StackItem>
            </>
          )}
          {isSubmitModeTagValues && (
            <StackItem>
              <TagValues
                currency={currency}
                errors={tagValuesErrors}
                onDelete={handleOnTagValuesDelete}
                onDefaultChange={handleOnTagValuesDefaultChange}
                onDescriptionChange={handleOnTagValuesDescriptionChange}
                onRateChange={handleOnTagValuesRateChange}
                onValueChange={handleOnTagValuesValueChange}
                tagValues={tagValues}
              />
            </StackItem>
          )}
          {(isSubmitModeGpuValues || isSubmitModeTagValues) && (
            <Button
              icon={<PlusCircleIcon />}
              onClick={isSubmitModeGpuValues ? handleOnGpuTagValuesAdd : handleOnTagValuesAdd}
              variant={ButtonVariant.link}
            >
              {intl.formatMessage(isSubmitModeGpuValues ? messages.costModelsAddGpu : messages.costModelsAddTagValues)}
            </Button>
          )}
        </Stack>
      </Form>
    );
  }
);

RatesContent.displayName = 'RatesContent';

const useMapToProps = (): RatesContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // Fetch metrics
  const metricsHash = useSelector((state: RootState) => metricsSelectors.metrics(state));
  const metricsHashByName = useSelector((state: RootState) => metricsSelectors.metricsByName(state));
  const metricsHashStatus = useSelector((state: RootState) => metricsSelectors.status(state));

  useEffect(() => {
    if (metricsHashStatus !== FetchStatus.inProgress && metricsHashStatus !== FetchStatus.complete) {
      dispatch(metricsActions.fetchMetrics());
    }
  }, [metricsHashStatus]);

  // Fetch GPU vendors
  const reportQuery: Query = {
    limit: 100,
  };
  const reportQueryString = getQuery(reportQuery);
  const resource = useSelector((state: RootState) =>
    resourceSelectors.selectResource(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );
  const resourceFetchStatus = useSelector((state: RootState) =>
    resourceSelectors.selectResourceFetchStatus(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );
  const resourceError = useSelector((state: RootState) =>
    resourceSelectors.selectResourceError(state, ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString)
  );

  useEffect(() => {
    if (
      !resourceError &&
      resourceFetchStatus !== FetchStatus.inProgress &&
      resourceFetchStatus !== FetchStatus.complete
    ) {
      dispatch(resourceActions.fetchResource(ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString));
    }
  }, [reportQueryString, resourceError, resourceFetchStatus, ResourcePathsType.ocp, ResourceType.gpuVendor]);

  return {
    metricsHash,
    metricsHashByName,
    metricsHashStatus,
    resource,
    resourceError,
    resourceFetchStatus,
  };
};

export { RatesContent };
