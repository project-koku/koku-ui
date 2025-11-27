import type { Rate } from '@koku-ui/api/rates';

import { formatCurrencyRateRaw } from '../../../../../utils/format';
import type { RateFormData } from './utils';

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
  if (rate.metric.name !== rateFormData.measurement.value) {
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
    const value = formatCurrencyRateRaw(rate.tiered_rates[0].value, rate.tiered_rates[0].unit);
    if (value !== rateFormData.tieredRates[0].value) {
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
      const value = formatCurrencyRateRaw(tvalue.value, tvalue.unit);
      return (
        tvalue.tag_value !== cur.tagValue ||
        value !== cur.value ||
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
