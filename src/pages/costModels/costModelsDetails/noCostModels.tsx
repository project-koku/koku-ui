import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { intl as defaultIntl } from 'components/i18n';
import HookIntoProps from 'hook-into-props';
import messages from 'locales/messages';
import { CreateCostModelButton } from 'pages/costModels/costModelsDetails/createCostModelButton';
import React from 'react';
import { injectIntl } from 'react-intl';

import EmptyStateBase from './emptyStateBase';

// defaultIntl required for testing
const NoCostModels = HookIntoProps(({ intl = defaultIntl }) => {
  return {
    title: intl.formatMessage(messages.CostModelsEmptyState),
    description: intl.formatMessage(messages.CostModelsEmptyStateDesc),
    icon: PlusCircleIcon,
    actions: (
      <>
        <CreateCostModelButton />
        <br />
        <br />
        <a href={intl.formatMessage(messages.DocsConfigCostModels)} rel="noreferrer" target="_blank">
          {intl.formatMessage(messages.CostModelsEmptyStateLearnMore)}
        </a>
      </>
    ),
  };
})(EmptyStateBase);

export default injectIntl(NoCostModels);
