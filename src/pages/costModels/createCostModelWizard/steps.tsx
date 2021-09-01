import messages from 'locales/messages';
import { MessageDescriptor } from 'react-intl';

export const nameErrors = (name: string): MessageDescriptor | null => {
  if (name.length === 0) {
    return messages.CostModelsRequiredField;
  }
  if (name.length > 100) {
    return messages.CostModelsInfoTooLong;
  }
  return null;
};

export const descriptionErrors = (description: string): MessageDescriptor | null => {
  if (description.length > 500) {
    return messages.CostModelsDescTooLong;
  }
  return null;
};

export const validatorsHash = {
  '': [() => false],
  AWS: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    () => true,
    () => true,
  ],
  AZURE: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    () => true,
    () => true,
  ],
  GCP: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    () => true,
    () => true,
  ],
  OCP: [
    ctx => nameErrors(ctx.name) === null && descriptionErrors(ctx.description) === null && ctx.type !== '',
    ctx => ctx.priceListCurrent.justSaved,
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    () => true,
    () => true,
  ],
};
