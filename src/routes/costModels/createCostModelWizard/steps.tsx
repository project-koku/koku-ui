import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { countDecimals, isPercentageFormatValid } from 'utils/format';

export const nameErrors = (name: string): string | null => {
  if (name.length === 0) {
    return intl.formatMessage(messages.costModelsRequiredField);
  }
  if (name.length > 100) {
    return intl.formatMessage(messages.costModelsInfoTooLong);
  }
  return null;
};

export const descriptionErrors = (description: string): string | null => {
  if (description.length > 500) {
    return intl.formatMessage(messages.costModelsDescTooLong);
  }
  return null;
};

const isMarkupValid = value => {
  if (value.trim() === '') {
    return false;
  }
  if (!isPercentageFormatValid(value)) {
    return false;
  }
  // Test number of decimals
  const decimals = countDecimals(value);
  if (decimals > 10) {
    return false;
  }
  return true;
};

export const validatorsHash = {
  '': [() => false],
  AWS: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => isMarkupValid(ctx.markup),
    () => true,
    () => true,
  ],
  Azure: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => isMarkupValid(ctx.markup),
    () => true,
    () => true,
  ],
  GCP: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => isMarkupValid(ctx.markup),
    () => true,
    () => true,
  ],
  OCP: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => ctx.priceListCurrent.justSaved,
    ctx => isMarkupValid(ctx.markup),
    () => true,
    () => true,
  ],
};
