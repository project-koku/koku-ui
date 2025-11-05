import type { RateFormData } from './utils';

export function canSubmit(rateFormData: RateFormData): boolean {
  if (rateFormData.rateKind === 'tagging') {
    return (
      rateFormData.errors.description === null &&
      rateFormData.errors.measurement === null &&
      rateFormData.errors.tagValues.every(err => err === null) &&
      rateFormData.errors.tagValueValues.every(err => err === null) &&
      rateFormData.errors.tagDescription.every(err => err === null) &&
      rateFormData.errors.tagKey === null
    );
  }
  return (
    rateFormData.errors.description === null &&
    rateFormData.errors.measurement === null &&
    rateFormData.errors.tieredRates === null
  );
}
