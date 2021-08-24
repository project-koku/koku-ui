import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import HookIntoProps from 'hook-into-props';
import { CreateCostModelButton } from 'pages/costModels/costModelsDetails/createCostModelButton';
import React from 'react';
import { useTranslation } from 'react-i18next';

import EmptyStateBase from './emptyStateBase';

const NoCostModels = HookIntoProps(() => {
  const { t } = useTranslation();
  return {
    title: t('page_cost_models.no_cost_models_title'),
    description: t('page_cost_models.no_cost_models_description'),
    icon: PlusCircleIcon,
    actions: (
      <>
        <CreateCostModelButton />
        <br />
        <br />
        <a href={t('docs.config_cost_models')} rel="noreferrer" target="_blank">
          {t('page_cost_models.no_cost_models_learn_more')}
        </a>
      </>
    ),
  };
})(EmptyStateBase);

export default NoCostModels;
