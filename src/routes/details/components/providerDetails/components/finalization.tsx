import { Content, ContentVariants, ProgressStep, ProgressStepper } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { formatDate } from 'routes/details/components/providerDetails/utils/format';
import { getProgressStepIcon } from 'routes/details/components/providerDetails/utils/icon';
import { getProgressStepVariant } from 'routes/details/components/providerDetails/utils/variant';

import { styles } from './component.styles';

interface FinalizationDataOwnProps {
  provider: Provider;
  providerType: ProviderType;
}

type FinalizationDataProps = FinalizationDataOwnProps;

const Finalization: React.FC<FinalizationDataProps> = ({ provider, providerType }: FinalizationDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  const title = intl.formatMessage(
    providerType === ProviderType.ocp ? messages.dataDetailsCostManagementData : messages.finalization
  );

  return (
    <>
      <Content>
        <Content component={ContentVariants.h3}>{title}</Content>
      </Content>
      <ProgressStepper aria-label={title} isVertical style={styles.stepper}>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsIntegrationAndFinalization)}
          icon={getProgressStepIcon(provider.status?.summary?.state)}
          id="step1"
          titleId="step1-title"
          variant={getProgressStepVariant(provider.status?.summary?.state)}
        >
          {intl.formatMessage(messages.dataDetailsIntegrationAndFinalization)}
          <div style={styles.description}>
            {formatDate(provider.status?.summary?.end || provider.status?.summary?.start)}
          </div>
        </ProgressStep>
      </ProgressStepper>
    </>
  );
};

export { Finalization };
