import { ProgressStep, ProgressStepper, Text, TextContent, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { styles } from 'routes/details/components/providerDetails/clusterDetails/clusterDetails.styles';
import { formatDate } from 'routes/details/components/providerDetails/clusterDetails/utils/format';
import { getProgressStepIcon } from 'routes/details/components/providerDetails/clusterDetails/utils/icon';
import { getProgressStepVariant } from 'routes/details/components/providerDetails/clusterDetails/utils/variant';

interface CostDataOwnProps {
  provider: Provider;
}

type CostDataProps = CostDataOwnProps;

const CostData: React.FC<CostDataProps> = ({ provider }: CostDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsCostManagementData)}</Text>
      </TextContent>
      <ProgressStepper
        aria-label={intl.formatMessage(messages.dataDetailsCostManagementData)}
        isVertical
        style={styles.stepper}
      >
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

export { CostData };
