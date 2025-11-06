import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl } from 'react-intl';
import { CreateCostModelButton } from 'routes/settings/costModels/costModelsDetails/createCostModelButton';

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
