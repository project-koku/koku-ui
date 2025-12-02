import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import React from 'react';
import { injectIntl } from 'react-intl';

import { CreateCostModelButton } from './createCostModelButton';
import EmptyStateBase from './emptyStateBase';

// defaultIntl required for testing
const NoCostModels = ({ intl = defaultIntl }) => {
  return (
    <EmptyStateBase
      title={intl.formatMessage(messages.costModelsEmptyState)}
      description={intl.formatMessage(messages.costModelsEmptyStateDesc)}
      icon={PlusCircleIcon}
      actions={
        <>
          <CreateCostModelButton />
          <br />
          <br />
          <a href={intl.formatMessage(messages.docsCostModels)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.costModelsEmptyStateLearnMore)}
          </a>
        </>
      }
    />
  );
};

export default injectIntl(NoCostModels);
