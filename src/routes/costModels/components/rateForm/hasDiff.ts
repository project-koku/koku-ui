import { Rate } from 'api/rates';

import { RateFormData } from './utils';

export function hasDiff(rate: Rate, rateFormData: RateFormData): boolean {
  if (!rate) {
    return true;
  }
  if (rate.description !== rateFormData.description) {
    return true;
  }
  if (rate.metric.label_metric !== rateFormData.metric) {
    return true;
  }
  if (rate.metric.label_measurement !== rateFormData.measurement.value) {
    return true;
  }
  if (rate.cost_type !== rateFormData.calculation) {
    return true;
  }
  const rateKind = rate.tiered_rates ? 'regular' : 'tagging';
  if (rateKind !== rateFormData.rateKind) {
    return true;
  }
  if (rateKind === 'regular') {
    if (Number(rate.tiered_rates[0].value) !== Number(rateFormData.tieredRates[0].value)) {
      return true;
    }
  }
  if (rateKind === 'tagging') {
    const tr = rate.tag_rates;
    if (tr.tag_key !== rateFormData.taggingRates.tagKey.value) {
      return true;
    }
    if (tr.tag_values.length !== rateFormData.taggingRates.tagValues.length) {
      return true;
    }
    const hasTagValuesDiff = tr.tag_values.some((tvalue, ix) => {
      const cur = rateFormData.taggingRates.tagValues[ix];
      const isCurDefault = rateFormData.taggingRates.defaultTag === ix;
      return (
        tvalue.tag_value !== cur.tagValue ||
        Number(tvalue.value) !== Number(cur.inputValue) ||
        tvalue.description !== cur.description ||
        tvalue.default !== isCurDefault
      );
    });
    if (hasTagValuesDiff) {
      return true;
    }
  }
  return false;
}
