import React from 'react';
import GeneralInformation from './generalInformation';
import Markup from './markup';
import PriceList from './priceList';
import Review from './review';
import Sources from './sources';

export const stepsHash = (t: (text: string) => string) => ({
  '': [
    {
      id: 1,
      name: t('cost_models_wizard.steps.general_info'),
      component: <GeneralInformation />,
    },
  ],
  AZURE: [
    {
      id: 1,
      name: t('cost_models_wizard.steps.general_info'),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: t('cost_models_wizard.steps.markup'),
      component: <Markup />,
    },
    {
      id: 3,
      name: t('cost_models_wizard.steps.sources'),
      component: <Sources />,
    },
    {
      id: 4,
      name: t('cost_models_wizard.steps.review'),
      component: <Review />,
    },
  ],
  AWS: [
    {
      id: 1,
      name: t('cost_models_wizard.steps.general_info'),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: t('cost_models_wizard.steps.markup'),
      component: <Markup />,
    },
    {
      id: 3,
      name: t('cost_models_wizard.steps.sources'),
      component: <Sources />,
    },
    {
      id: 4,
      name: t('cost_models_wizard.steps.review'),
      component: <Review />,
    },
  ],
  OCP: [
    {
      id: 1,
      name: t('cost_models_wizard.steps.general_info'),
      component: <GeneralInformation />,
    },
    {
      id: 2,
      name: t('cost_models_wizard.steps.price_list'),
      component: <PriceList />,
    },
    {
      id: 3,
      name: t('cost_models_wizard.steps.markup'),
      component: <Markup />,
    },
    {
      id: 4,
      name: t('cost_models_wizard.steps.sources'),
      component: <Sources />,
    },
    {
      id: 5,
      name: t('cost_models_wizard.steps.review'),
      component: <Review />,
    },
  ],
});

export const validatorsHash = {
  '': [ctx => false],
  AWS: [
    ctx => ctx.name !== '' && ctx.type !== '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    ctx => true,
    ctx => true,
  ],
  AZURE: [
    ctx => ctx.name !== '' && ctx.type !== '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    ctx => true,
    ctx => true,
  ],
  OCP: [
    ctx => ctx.name !== '' && ctx.type !== '',
    ctx =>
      ctx.priceListCurrent.metric === '' &&
      ctx.priceListCurrent.measurement === '' &&
      ctx.priceListCurrent.rate === '',
    ctx => ctx.markup !== '' && !isNaN(Number(ctx.markup)),
    ctx => true,
    ctx => true,
  ],
};
