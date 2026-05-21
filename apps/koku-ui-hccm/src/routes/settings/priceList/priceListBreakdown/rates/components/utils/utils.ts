import type { Metric, MetricHash } from 'api/metrics';
import type { Rate, TagValue, TieredRate } from 'api/rates';
import messages from 'locales/messages';
import type { MessageDescriptor } from 'react-intl';
import { countDecimals, isCurrencyFormatValid } from 'utils/format';

interface TagRate {
  metric: string | Metric;
  measurement: string;
  costType: string;
  tagKey: string;
}

// Use separate value property to avoid converting bad user input to a number
export interface TieredRateExt extends TieredRate {
  valueInput?: string;
}

// Use separate value property to avoid converting bad user input to a number
export interface TagValueExt extends TagValue {
  valueInput?: string;
}

/** Per-row validation messages for tag value / rate / description fields (matches EditTagValues `errors[index]`). */
export type TagValueRowErrors = Partial<Record<'description' | 'tag_value' | 'value', MessageDescriptor>>;

export const getDefaultCostType = (metricsHash: MetricHash, metric: string) => {
  let options = Object.keys(metricsHash);
  if (!options.includes(metric)) {
    return '';
  }
  options = Object.keys(metricsHash[metric]);
  if (options.length === 0) {
    return '';
  }
  return metricsHash[metric][options[0]].default_cost_type;
};

export const hasTagValuesErrors = (errors: TagValueRowErrors[]): boolean => {
  return errors.some(row => Boolean(row?.tag_value || row?.value || row?.description));
};

/**
 * True when any row differs from baseline, or when row counts differ.
 * (The previous filter/length check compared “number of dirty rows” to baseline length, which is false
 * for a single clean row: 0 !== 1 → incorrectly dirty.)
 */
export const hasDirtyTagValues = (
  tagValues: TagValue[] | undefined,
  tagValuesBaseline: TagValueExt[] | undefined
): boolean => {
  const current = tagValues ?? [];
  const baseline = tagValuesBaseline ?? [];
  if (current.length !== baseline.length) {
    return true;
  }
  return current.some((t, i) => {
    const b = baseline[i];
    return (
      t.default !== b?.default ||
      t.description !== b?.description ||
      t.tag_value !== b?.tag_value ||
      t.unit !== b?.unit ||
      t.value !== b?.value
    );
  });
};

export const hasDuplicateTagRates = (a: TagRate, b: TagRate) => {
  return (
    a?.metric === b?.metric &&
    a?.measurement === b?.measurement &&
    a?.costType === b?.costType &&
    a?.tagKey === b?.tagKey
  );
};

export const hasInvalidTagValues = (tagValues: TagValue[]) => {
  return tagValues?.find(t => {
    return !(t.tag_value && t.value && Number(t.value ?? 0) > 0);
  });
};

export const validateDescription = (value: string) => {
  if (value.length > 500) {
    return messages.costModelsDescTooLong;
  }
  return null;
};

export const validateName = (value: string, rates: Rate[], rateIndex: number) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 50) {
    return messages.priceListNameTooLong;
  }

  const isDuplicate = rates?.find(
    (item, i) => i !== rateIndex && item?.custom_name?.trim().toLowerCase() === value?.trim().toLowerCase()
  );
  if (isDuplicate) {
    return messages.priceListDuplicateName;
  }
  return null;
};

export const validateRate = (value: string): MessageDescriptor => {
  if (value.length === 0) {
    return messages.requiredField;
  }
  if (!isCurrencyFormatValid(value)) {
    return messages.priceListNumberRate;
  }
  if (Number(value) < 0) {
    return messages.priceListPosNumberRate;
  }
  // Test number of decimals
  const decimals = countDecimals(value);
  if (decimals > 10) {
    return messages.costModelsRateTooLong;
  }
  return undefined;
};

export const validateTagKey = (value: string, isGpuMetric = false) => {
  if (value?.trim()?.length === 0) {
    return messages.requiredField;
  }
  if (value.length > 100) {
    return messages.costModelsInfoTooLong;
  }

  // Skip validation for GPU metric -- see https://redhat.atlassian.net/browse/COST-7241
  const pattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  if (!pattern.test(value) && !isGpuMetric) {
    return messages.costModelsUnsupportedTagChars;
  }
  return null;
};

export const validateTagKeyDuplicate = (rate, priceListRates, metricsHashByName: MetricHash) => {
  const isDuplicate = priceListRates?.find(item => {
    const metricName = item?.metric?.name ?? undefined;
    return hasDuplicateTagRates(rate, {
      costType: item?.cost_type,
      measurement: item.metric.name,
      metric: metricsHashByName?.[metricName]?.label_metric ?? undefined, // Todo: Replace with label_metric when available in price-lists API
      tagKey: item?.tag_rates?.tag_key,
    });
  });

  if (isDuplicate) {
    return messages.priceListDuplicateTag;
  }
  return null;
};

export const validateTagValue = (value: string, tagValues: TagValue[], index: number) => {
  const isDuplicate = tagValues?.find((item, i) => i !== index && item?.tag_value === value);

  if (isDuplicate) {
    return messages.priceListDuplicateValue;
  }
  return null;
};
