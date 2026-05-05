import {
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
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
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { TagValue } from 'api/rates';
import type { Resource } from 'api/resources/resource';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Selector, SimpleInput } from 'routes/settings/components';
import { RateInput } from 'routes/settings/components/rateInput';
import { SimpleArea } from 'routes/settings/components/simpleArea';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { metricsActions, metricsSelectors } from 'store/metrics';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { resourceActions, resourceSelectors } from 'store/resources';
import { unitsLookupKey } from 'utils/format';

import { styles } from './editRateModal.styles';
import { GpuTagKey } from './gpu/gpuTagKey';
import { GpuTagValues } from './gpu/gpuTagValues';
import { TagValues } from './tag/tagValues';
import type { TagValueRowErrors } from './utils';
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
} from './utils';

interface EditRateModalOwnProps {
  isAddRate?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: () => void;
  priceList: PriceListData;
  rateIndex?: number;
}

interface EditRateModalMapProps {
  priceList: PriceListData;
}

interface EditRateModalStateProps {
  metricsHash: MetricHash;
  metricsHashByName: MetricHash;
  metricsHashStatus: FetchStatus;
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
  resource: Resource;
  resourceError: AxiosError;
  resourceFetchStatus: FetchStatus;
}

type EditRateModalProps = EditRateModalOwnProps;

const EditRateModal: React.FC<EditRateModalProps> = ({
  isAddRate = false,
  isOpen = false,
  onClose,
  onUpdateSuccess,
  priceList,
  rateIndex,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isFinish, setIsFinish] = useState(false);
  const { metricsHash, metricsHashByName, priceListUpdateError, priceListUpdateStatus, resource, resourceFetchStatus } =
    useMapToProps({
      priceList,
    });

  // State management
  const [costType, setCostType] = useState<string>();
  const [costTypeBaseline, setCostTypeBaseline] = useState<string>();
  const [currency, setCurrency] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [descriptionBaseline, setDescriptionBaseline] = useState<string>();
  const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
  const [gpuTagKey, setGpuTagKey] = useState<string>();
  const [gpuTagKeyBaseline, setGpuTagKeyBaseline] = useState<string>();
  const [gpuTagKeyError, setGpuTagKeyError] = useState<MessageDescriptor>();
  const [gpuTagValues, setGpuTagValues] = useState<TagValue[]>();
  const [gpuTagValuesBaseline, setGpuTagValuesBaseline] = useState<TagValue[]>();
  const [gpuTagValuesErrors, setGpuTagValuesErrors] = useState<TagValueRowErrors[]>([]);
  const [isSubmitModeGpuValues, setIsSubmitModeGpuValues] = useState<boolean>(false);
  const [isSubmitModeTagValues, setIsSubmitModeTagValues] = useState<boolean>(false);
  const [isSubmitModeTierdValue, setIsSubmitModeTierdValue] = useState<boolean>(false);
  const [isTagRatesChecked, setIsTagRatesChecked] = useState<boolean>(false);
  const [isTagRatesDisabled, setIsTagRatesDisabled] = useState<boolean>(false);
  const [measurement, setMeasurement] = useState<string>();
  const [measurementBaseline, setMeasurementBaseline] = useState<string>();
  const [metric, setMetric] = useState<string>();
  const [metricBaseline, setMetricBaseline] = useState<string>();
  const [name, setName] = useState<string>();
  const [nameBaseline, setNameBaseline] = useState<string>();
  const [nameError, setNameError] = useState<MessageDescriptor>();
  const [tagKey, setTagKey] = useState<string>();
  const [tagKeyBaseline, setTagKeyBaseline] = useState<string>();
  const [tagKeyError, setTagKeyError] = useState<MessageDescriptor>();
  const [tagValues, setTagValues] = useState<TagValue[]>();
  const [tagValuesBaseline, setTagValuesBaseline] = useState<TagValue[]>();
  const [tagValuesErrors, setTagValuesErrors] = useState<TagValueRowErrors[]>([]);
  const [tierdRates, setTierdRates] = useState<string | number>();
  const [tierdRatesBaseline, setTierdRatesBaseline] = useState<string | number>();
  const [tierdRatesError, setTierdRatesError] = useState<MessageDescriptor>();

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
  const isTierdRatesDirty = Number(tierdRates) !== Number(tierdRatesBaseline);

  // Validation checks

  const isGpuTagKeyInvalid = (!gpuTagKey && isGpuTagKeyDirty) || gpuTagKeyError !== undefined;
  const isGpuTagValuesInvalid =
    isSubmitModeGpuValues &&
    isGpuTagValuesDirty &&
    (hasInvalidTagValues(gpuTagValues) !== undefined || hasTagValuesErrors(gpuTagValuesErrors));
  const isNameInvalid = name?.trim().length === 0 || nameError !== undefined;
  const isMeasurementInvalid = !measurement && isMeasurementDirty;
  const isTagKeyInvalid = (!tagKey && isTagKeyDirty) || tagKeyError !== undefined;
  const isTagValuesInvalid =
    isSubmitModeTagValues &&
    isTagValuesDirty &&
    (hasInvalidTagValues(tagValues) !== undefined || hasTagValuesErrors(tagValuesErrors));
  const isTierdRatesInvalid =
    isSubmitModeTierdValue &&
    isTierdRatesDirty &&
    (!tierdRates || Number(tierdRates) <= 0 || tierdRatesError !== undefined);

  // Unsaved changes checks
  const hasAddRateChanges =
    isDescriptionDirty ||
    (isCostTypeDirty &&
      isMeasurementDirty &&
      isMetricDirty &&
      isNameDirty &&
      ((isSubmitModeGpuValues && isGpuTagKeyDirty && isGpuTagValuesDirty) ||
        (isSubmitModeTagValues && isTagKeyDirty && isTagValuesDirty) ||
        (isSubmitModeTierdValue && isTierdRatesDirty)));

  const hasEditRateChanges =
    isCostTypeDirty ||
    isDescriptionDirty ||
    isMeasurementDirty ||
    isMetricDirty ||
    isNameDirty ||
    (isSubmitModeGpuValues && (isGpuTagKeyDirty || isGpuTagValuesDirty)) ||
    (isSubmitModeTagValues && (isTagKeyDirty || isTagValuesDirty)) ||
    (isSubmitModeTierdValue && isTierdRatesDirty);

  const hasUnsavedChanges = isAddRate ? hasAddRateChanges : hasEditRateChanges;

  const isSaveDisabled =
    !hasUnsavedChanges ||
    isGpuTagKeyInvalid ||
    isGpuTagValuesInvalid ||
    isNameInvalid ||
    isMeasurementInvalid ||
    isTagKeyInvalid ||
    isTagValuesInvalid ||
    isTierdRatesInvalid ||
    priceListUpdateStatus === FetchStatus.inProgress;

  // useState only uses `priceList` on the first mount. Sync when the loaded entity changes.
  useEffect(() => {
    if (isOpen) {
      // Todo: Replace with label_metric when available in price-lists API
      const metricName = priceList?.rates?.[rateIndex]?.metric?.name ?? undefined;
      const labelMetric = (metricsHashByName?.[metricName]?.label_metric ?? '') as string;

      // Defaults
      const defaultCostType = metricsHash?.[metricName]?.default_cost_type ?? '';
      const defaultCurrency = priceList?.currency ?? 'USD';
      const defaultTagValue = { default: false, description: '', unit: defaultCurrency };
      const initialTagValues = priceList?.rates?.[rateIndex]?.tag_rates?.tag_values ?? [defaultTagValue];

      // State management
      setCostType((priceList?.rates?.[rateIndex]?.cost_type ?? defaultCostType) as string);
      setCostTypeBaseline((priceList?.rates?.[rateIndex]?.cost_type ?? defaultCostType) as string);
      setCurrency(defaultCurrency);
      setDescription(priceList?.rates?.[rateIndex]?.description ?? '');
      setDescriptionBaseline(priceList?.rates?.[rateIndex]?.description ?? '');
      setDescriptionError(undefined);
      setGpuTagKey(priceList?.rates?.[rateIndex]?.tag_rates?.tag_key ?? '');
      setGpuTagKeyBaseline(priceList?.rates?.[rateIndex]?.tag_rates?.tag_key ?? '');
      setGpuTagKeyError(undefined);
      setGpuTagValues(cloneDeep(initialTagValues));
      setGpuTagValuesBaseline(cloneDeep(initialTagValues));
      setGpuTagValuesErrors(initialTagValues?.map(() => ({})));
      setMeasurement(metricName ?? '');
      setMeasurementBaseline(metricName ?? '');
      setMetric(labelMetric);
      setMetricBaseline(labelMetric);
      setName(priceList?.rates?.[rateIndex]?.custom_name ?? '');
      setNameBaseline(priceList?.rates?.[rateIndex]?.custom_name ?? '');
      setNameError(undefined);
      setTagKey(priceList?.rates?.[rateIndex]?.tag_rates?.tag_key ?? '');
      setTagKeyError(undefined);
      setTagKeyBaseline(priceList?.rates?.[rateIndex]?.tag_rates?.tag_key ?? '');
      setTagValues(cloneDeep(initialTagValues));
      setTagValuesBaseline(cloneDeep(initialTagValues));
      setTagValuesErrors(initialTagValues?.map(() => ({})));
      setTierdRates(cloneDeep(priceList?.rates?.[rateIndex]?.tiered_rates?.[0]?.value ?? undefined));
      setTierdRatesBaseline(cloneDeep(priceList?.rates?.[rateIndex]?.tiered_rates?.[0]?.value ?? undefined));
      setTierdRatesError(undefined);

      updateSubmitMode(labelMetric, priceList?.rates?.[rateIndex]?.tag_rates?.tag_key !== undefined);
    }
  }, [isOpen, priceList, rateIndex]);

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
    const value = m.replace(/ /g, '_').toLowerCase();
    return intl.formatMessage(messages.metricValues, { value }) || m;
  };

  const metricOptions: SelectWrapperOption[] = React.useMemo(() => {
    const hasGpuVendor = resource?.data?.length > 0 && resourceFetchStatus === FetchStatus.complete;
    if (!metricsHash) {
      return [];
    }
    return Object.keys(metricsHash)
      ?.map(m => ({
        isDisabled: m.toLowerCase() === 'gpu' && !hasGpuVendor,
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
      value: o.toLowerCase().replace('-', '_'),
      units: units ? units : u,
    });
    return desc ? desc : o;
  };

  const getMeasurementLabel = (m, u) => {
    // Match message descriptor or default to API string
    const units = intl.formatMessage(messages.units, { units: unitsLookupKey(u) }) || u;
    const value = m.toLowerCase().replace('-', '_');
    return intl.formatMessage(messages.measurementValues, { value, units, count: 2 }) || m;
  };

  const measurementOptions: SelectWrapperOption[] = React.useMemo(() => {
    if (!metricOptions.find(m => m.value === metric)) {
      return [];
    }
    return Object.keys(metricsHash?.[metric])
      ?.map(opt => {
        const m = metricsHash[metric][opt];
        const unit = m.label_measurement_unit;
        return {
          description: getMeasurementDescription(m.label_measurement, unit),
          isDisabled: false,
          toString: () => getMeasurementLabel(m.label_measurement, unit),
          value: m.metric,
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
    const newTagValues = cloneDeep(gpuTagValues ?? []);
    newTagValues[index].value = value;
    setGpuTagValues(newTagValues);
    updateGpuTagValuesErrors('value', validateRate(value), index);
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
    updateSubmitMode(value, isTagRatesChecked);

    const duplicateTagKeyError = validateTagKeyDuplicate(
      {
        costType,
        measurement,
        metric: value,
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

  const handleOnNameChange = (value: string) => {
    setName(value);

    const error = validateName(value);
    if (error) {
      setNameError(error);
    } else {
      setNameError(undefined);
    }
  };

  const handleOnSave = () => {
    setIsFinish(true);

    let newRates = {};
    if (isSubmitModeGpuValues) {
      newRates = {
        tag_rates: {
          tag_key: gpuTagKey,
          tag_values: gpuTagValues,
        },
      };
    } else if (isSubmitModeTagValues) {
      newRates = {
        tag_rates: {
          tag_key: tagKey,
          tag_values: tagValues,
        },
      };
    } else if (isSubmitModeTierdValue) {
      newRates = {
        tiered_rates: [
          {
            unit: currency,
            usage: {
              unit: currency,
            },
            value: tierdRates,
          },
        ],
      };
    }

    const rate = {
      cost_type: costType,
      custom_name: name,
      description,
      metric: {
        name: measurement,
      },
      ...newRates,
    };

    const existingRates: any = [...(priceList?.rates ?? [])];
    let rates;

    if (isAddRate) {
      rates = [...existingRates, rate];
    } else {
      rates = [...existingRates];
      rates[rateIndex] = rate;
    }

    dispatch(
      priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
        ...(priceList ?? {}),
        rates,
      })
    );
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

  const handleOnTagRatesChange = (value: boolean) => {
    updateSubmitMode(metric, value);
  };

  const handleOnTagValuesAdd = () => {
    setTagValues([...(tagValues ?? []), { default: false, description: '', unit: currency }]);
    setTagValuesErrors(prev => [...prev, {}]);
  };

  const handleOnTagValuesDefaultChange = (value: boolean, index: number) => {
    const newTagValues = cloneDeep(tagValues ?? []);
    newTagValues[index].default = value;
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
    const newTagValues = cloneDeep(tagValues ?? []);
    newTagValues[index].value = value;
    setTagValues(newTagValues);
    updateTagValuesErrors('value', validateRate(value), index);
  };

  const handleOnTagValuesValueChange = (value: string, index: number) => {
    const newTagValues = cloneDeep(tagValues ?? []);
    newTagValues[index].tag_value = value;
    setTagValues(newTagValues);

    const error = validateTagKey(value, isSubmitModeGpuValues) || validateTagValue(value, tagValues, index);
    updateTagValuesErrors('tag_value', error, index);
  };

  const handleOnTierdRatesChange = (value: string) => {
    setTierdRates(value);

    const error = validateRate(value);
    if (error) {
      setTierdRatesError(error);
    } else {
      setTierdRatesError(undefined);
    }
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
    if (value?.toLowerCase() === 'cluster') {
      setIsSubmitModeGpuValues(false);
      setIsSubmitModeTagValues(false);
      setIsSubmitModeTierdValue(true);
      setIsTagRatesChecked(false);
      setIsTagRatesDisabled(true);
    } else if (value?.toLowerCase() === 'gpu') {
      setIsSubmitModeGpuValues(true);
      setIsSubmitModeTagValues(false);
      setIsSubmitModeTierdValue(false);
      setIsTagRatesChecked(false);
      setIsTagRatesDisabled(false);
    } else if (value?.toLowerCase() === 'project') {
      setIsSubmitModeGpuValues(false);
      setIsSubmitModeTagValues(true);
      setIsSubmitModeTierdValue(false);
      setIsTagRatesChecked(true);
      setIsTagRatesDisabled(true);
    } else {
      setIsSubmitModeGpuValues(false);
      setIsSubmitModeTagValues(checked);
      setIsSubmitModeTierdValue(!checked);
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
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onUpdateSuccess?.();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal
      className="costManagement"
      isOpen={isOpen}
      onClose={onClose}
      style={styles.modal}
      variant={ModalVariant.large}
    >
      <ModalHeader title={intl.formatMessage(isAddRate ? messages.priceListAddRate : messages.priceListEditRate)} />
      <ModalBody>
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
                  {isSubmitModeTierdValue ? (
                    <RateInput
                      currencyUnits={currency}
                      fieldId="tiered-rate"
                      helperTextInvalid={tierdRatesError}
                      onChange={(_evt, value) => handleOnTierdRatesChange(value)}
                      validated={tierdRatesError ? 'error' : 'default'}
                      value={tierdRates}
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
                  {(isSubmitModeTagValues || isSubmitModeTierdValue) && (
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
                {intl.formatMessage(
                  isSubmitModeGpuValues ? messages.costModelsAddGpu : messages.costModelsAddTagValues
                )}
              </Button>
            )}
          </Stack>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button isAriaDisabled={isSaveDisabled} onClick={handleOnSave} variant="primary">
          {intl.formatMessage(isAddRate ? messages.priceListAddRate : messages.save)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = ({ priceList }: EditRateModalMapProps): EditRateModalStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // Fetch metrics
  const metricsHash = useSelector((state: RootState) => metricsSelectors.metrics(state));
  const metricsHashByName = useSelector((state: RootState) => metricsSelectors.metricsByName(state));
  const metricsHashStatus = useSelector((state: RootState) => metricsSelectors.status(state));

  useEffect(() => {
    if (metricsHashStatus !== FetchStatus.inProgress && metricsHashStatus !== FetchStatus.complete) {
      dispatch(metricsActions.fetchMetrics());
    }
  }, [metricsHashStatus, priceList]);

  // Price list update
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListUpdate, undefined)
  );
  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListUpdate, undefined)
  );

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
    if (!resourceError && resourceFetchStatus !== FetchStatus.inProgress) {
      dispatch(resourceActions.fetchResource(ResourcePathsType.ocp, ResourceType.gpuVendor, reportQueryString));
    }
  }, [reportQueryString, resourceError, resourceFetchStatus, ResourcePathsType.ocp, ResourceType.gpuVendor]);

  return {
    metricsHash,
    metricsHashByName,
    metricsHashStatus,
    priceListUpdateError,
    priceListUpdateStatus,
    resource,
    resourceError,
    resourceFetchStatus,
  };
};

export { EditRateModal };
