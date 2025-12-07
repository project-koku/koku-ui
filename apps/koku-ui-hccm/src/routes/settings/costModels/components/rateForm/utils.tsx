import { SortByDirection } from '@patternfly/react-table';
import type { CostModel, CostModelRequest } from 'api/costModels';
import type { MetricHash } from 'api/metrics';
import type { Rate, RateRequest, TagRates } from 'api/rates';
import { countDecimals, formatCurrencyRateRaw, isCurrencyFormatValid, unFormat } from 'utils/format';

import { textHelpers } from './constants';

export const initialTaggingRates = {
  tagKey: {
    isDirty: false,
    value: '',
  },
  defaultTag: null,
  tagValues: [
    {
      description: '',
      isDirty: false,
      isTagValueDirty: false,
      tagValue: '',
      value: '',
    },
  ],
};

export const initialRateFormData = {
  otherTiers: [] as Rate[],
  step: 'initial',
  description: '',
  metric: '',
  measurement: {
    value: '',
    isDirty: false,
  },
  calculation: '',
  rateKind: 'regular',
  tieredRates: [
    {
      isDirty: false,
      value: '',
    },
  ],
  taggingRates: { ...initialTaggingRates },
  errors: {
    description: null,
    measurement: textHelpers.required,
    tieredRates: textHelpers.required,
    tagValues: [textHelpers.required],
    tagDescription: [null],
    tagKey: textHelpers.required,
    tagValueValues: [textHelpers.required],
  },
};

export type RateFormData = typeof initialRateFormData;
export type RateFormTagValue = (typeof initialRateFormData)['taggingRates']['tagValues'][0];
export type taggingRates = (typeof initialRateFormData)['taggingRates'];
export type RateFormErrors = (typeof initialRateFormData)['errors'];

export const checkRateOnChange = (value: string) => {
  if (value.length === 0) {
    return textHelpers.required;
  }
  if (!isCurrencyFormatValid(value)) {
    return textHelpers.not_number;
  }
  if (Number(value) < 0) {
    return textHelpers.not_positive;
  }
  // Test number of decimals
  const decimals = countDecimals(value);
  if (decimals > 10) {
    return textHelpers.rate_too_long;
  }
  return null;
};

export function getDefaultCalculation(metricsHash: MetricHash, metric: string) {
  let options = Object.keys(metricsHash);
  if (!options.includes(metric)) {
    return '';
  }
  options = Object.keys(metricsHash[metric]);
  if (options.length === 0) {
    return '';
  }
  return metricsHash[metric][options[0]].default_cost_type;
}

export function genFormDataFromRate(rate: Rate, defaultValue = initialRateFormData, tiers: Rate[]): RateFormData {
  const otherTiers = tiers || defaultValue.otherTiers;

  if (!rate) {
    return { ...defaultValue, otherTiers };
  }
  const rateKind = rate.tiered_rates ? 'regular' : 'tagging';
  let tieredRates = [{ isDirty: true, value: '' }];
  const tagRates = { ...initialTaggingRates };
  const errors = {
    description: null,
    measurement: null,
    tieredRates: null,
    tagValues: [null],
    tagKey: null,
    tagValueValues: [null],
    tagDescription: [null],
  };
  if (rateKind === 'tagging') {
    const item = rate.tag_rates as TagRates;
    tagRates.tagKey = { isDirty: true, value: item.tag_key };
    const defaultIndex = item.tag_values.findIndex(tvalue => tvalue.default);
    tagRates.defaultTag = defaultIndex === -1 ? null : defaultIndex;
    tagRates.tagValues = item.tag_values.map(tvalue => {
      const value = formatCurrencyRateRaw(tvalue.value, tvalue.unit);
      return {
        description: tvalue.description,
        isDirty: false,
        isTagValueDirty: false,
        tagValue: tvalue.tag_value,
        value,
      };
    });
    errors.tieredRates = textHelpers.required;
    errors.tagValueValues = new Array(item.tag_values.length).fill(null);
    errors.tagValues = new Array(item.tag_values.length).fill(null);
    errors.tagDescription = new Array(item.tag_values.length).fill(null);
  }
  if (rateKind === 'regular') {
    tieredRates = rate.tiered_rates.map(tieredRate => {
      const value = formatCurrencyRateRaw(tieredRate.value, tieredRate.unit);
      return {
        isDirty: true,
        value,
      };
    });
    errors.tagValues = [textHelpers.required];
    errors.tagValueValues = [textHelpers.required];
  }
  return {
    otherTiers,
    step: 'set_rate',
    description: rate.description,
    metric: rate.metric.label_metric,
    measurement: {
      value: rate.metric.name,
      isDirty: true,
    },
    calculation: rate.cost_type,
    rateKind,
    tieredRates,
    taggingRates: tagRates,
    errors,
  };
}

export const mergeToRequest = (
  metricsHash: MetricHash,
  costModel: CostModel,
  rateFormData: RateFormData,
  index: number = -1
): CostModelRequest => {
  if (index < 0) {
    index = costModel.rates.length;
  }
  const rate = transformFormDataToRequest(rateFormData, metricsHash, costModel.currency) as RateRequest;
  return {
    currency: costModel.currency,
    name: costModel.name,
    source_type: 'OCP',
    description: costModel.description,
    distribution_info: {
      distribution_type: costModel.distribution_info ? costModel.distribution_info.distribution_type : undefined,
      gpu_unallocated: costModel.distribution_info ? costModel.distribution_info.gpu_unallocated : undefined,
      network_unattributed: costModel.distribution_info ? costModel.distribution_info.network_unattributed : undefined,
      platform_cost: costModel.distribution_info ? costModel.distribution_info.platform_cost : undefined,
      storage_unattributed: costModel.distribution_info ? costModel.distribution_info.storage_unattributed : undefined,
      worker_cost: costModel.distribution_info ? costModel.distribution_info.worker_cost : undefined,
    },
    source_uuids: costModel.sources.map(src => src.uuid),
    markup: { value: costModel.markup.value, unit: 'percent' },
    rates: [...costModel.rates.slice(0, index), rate, ...costModel.rates.slice(index + 1)],
  };
};

export const transformFormDataToRequest = (
  rateFormData: RateFormData,
  metricsHash: MetricHash,
  currencyUnits: string = 'USD'
): Rate => {
  const ratesKey = rateFormData.rateKind === 'tagging' ? 'tag_rates' : 'tiered_rates';
  const ratesBody =
    rateFormData.rateKind === 'tagging'
      ? {
          tag_key: rateFormData.taggingRates.tagKey.value,
          tag_values: rateFormData.taggingRates.tagValues.map((tvalue, ix) => {
            return {
              tag_value: tvalue.tagValue,
              unit: currencyUnits,
              value: unFormat(tvalue.value), // Normalize for API requests where USD decimal format is expected
              description: tvalue.description,
              default: ix === rateFormData.taggingRates.defaultTag,
            };
          }),
        }
      : rateFormData.tieredRates.map(tiered => {
          return {
            value: unFormat(tiered.value), // Normalize for API requests where USD decimal format is expected
            unit: currencyUnits,
            usage: { unit: currencyUnits },
          };
        });
  const metricData = metricsHash[rateFormData.metric][rateFormData.measurement.value];
  return {
    description: rateFormData.description,
    metric: {
      metric: metricData.metric,
      name: metricData.metric,
      label_metric: metricData.label_metric,
      label_measurement: metricData.label_measurement,
      label_measurement_unit: metricData.label_measurement_unit,
      source_type: 'OpenShift Cluster Platform',
      default_cost_type: metricData.default_cost_type,
    },
    cost_type: rateFormData.calculation,
    [ratesKey]: ratesBody,
  };
};

export interface OtherTier {
  metric: RateFormData['metric'];
  measurement: RateFormData['measurement']['value'];
  costType: RateFormData['calculation'];
  tagKey: RateFormData['taggingRates']['tagKey']['value'];
}

export const OtherTierFromRate = (rate: Rate): OtherTier => {
  const tagKey = rate.tag_rates && rate.tag_rates.tag_key ? rate.tag_rates.tag_key : null;
  return {
    metric: rate.metric.label_metric,
    measurement: rate.metric.name,
    tagKey,
    costType: rate.cost_type,
  };
};

export const OtherTierFromRateForm = (rateData: RateFormData): OtherTier => {
  const tagKey = rateData.taggingRates && rateData.taggingRates.tagKey ? rateData.taggingRates.tagKey.value : null;
  const res = {
    metric: rateData.metric,
    measurement: rateData.measurement ? rateData.measurement.value : null,
    tagKey,
    costType: rateData.calculation,
  };
  return res;
};

export const isDuplicateTagRate = (rate: OtherTier, current: OtherTier) => {
  return (
    rate.metric === current.metric &&
    rate.measurement === current.measurement &&
    rate.costType === current.costType &&
    rate.tagKey === current.tagKey
  );
};

export type CompareResult = 1 | -1 | 0;

export function compareBy(
  r1: Rate,
  r2: Rate,
  direction: keyof typeof SortByDirection,
  projection: (r: Rate) => string
): CompareResult {
  const m1 = projection(r1);
  const m2 = projection(r2);
  if (direction === SortByDirection.asc) {
    return m1 > m2 ? 1 : m1 < m2 ? -1 : 0;
  }
  return m1 > m2 ? -1 : m1 < m2 ? 1 : 0;
}

export const descriptionErrors = (value: string) => {
  if (value.length > 500) {
    return textHelpers.description_too_long;
  }
  return null;
};

export const tagKeyValueErrors = (value: string) => {
  if (value.length === 0) {
    return textHelpers.required;
  }
  if (value.length > 100) {
    return textHelpers.tag_too_long;
  }

  const pattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  if (!pattern.test(value)) {
    return textHelpers.unsupported_tag_chars;
  }
  return null;
};
