import messages from 'locales/messages';
import React from 'react';
import { MessageDescriptor } from 'react-intl';

import GeneralInformation from './generalInformation';
import Markup from './markup';
import PriceList from './priceList';
import Review from './review';
import Sources from './sources';

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

// (t: (text: string) => string)
export const stepsHash = intl => ({
  '': [
    {
      id: 1,
      name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
      component: <GeneralInformation />,
    },
  ],
  AZURE: [
    {
      id: 1,
      name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: intl.formatMessage(messages.CostCalculations),
      component: <Markup />,
    },
    {
      id: 3,
      name: intl.formatMessage(messages.CostModelsWizardStepsSources),
      component: <Sources />,
    },
    {
      id: 4,
      name: intl.formatMessage(messages.CostModelsWizardStepsReview),
      component: <Review />,
    },
  ],
  AWS: [
    {
      id: 1,
      name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: intl.formatMessage(messages.CostCalculations),
      component: <Markup />,
    },
    {
      id: 3,
      name: intl.formatMessage(messages.CostModelsWizardStepsSources),
      component: <Sources />,
    },
    {
      id: 4,
      name: intl.formatMessage(messages.CostModelsWizardStepsReview),
      component: <Review />,
    },
  ],
  GCP: [
    {
      id: 1,
      name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: intl.formatMessage(messages.CostCalculations),
      component: <Markup />,
    },
    {
      id: 3,
      name: intl.formatMessage(messages.CostModelsWizardStepsSources),
      component: <Sources />,
    },
    {
      id: 4,
      name: intl.formatMessage(messages.CostModelsWizardStepsReview),
      component: <Review />,
    },
  ],
  OCP: [
    {
      id: 1,
      name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: intl.formatMessage(messages.CostModelsWizardStepsPriceList),
      component: <PriceList />,
    },
    {
      id: 3,
      name: intl.formatMessage(messages.CostCalculations),
      component: <Markup />,
    },
    {
      id: 4,
      name: intl.formatMessage(messages.CostModelsWizardStepsSources),
      component: <Sources />,
    },
    {
      id: 5,
      name: intl.formatMessage(messages.CostModelsWizardStepsReview),
      component: <Review />,
    },
  ],
});

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
