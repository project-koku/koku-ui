import { ProgressStep, ProgressStepper, Text, TextContent, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { SourceLink } from 'routes/details/ocpBreakdown/providerDetails/components/sourceLink';
import { styles } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/dataDetails.styles';
import { formatDate } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/format';
import { getProgressStepIcon } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/icon';
import { getProviderAvailability } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/status';
import { getProgressStepVariant } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/utils/variant';

interface ClusterDataOwnProps {
  provider: Provider;
}

type ClusterDataProps = ClusterDataOwnProps;

const ClusterData: React.FC<ClusterDataProps> = ({ provider }: ClusterDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsClusterData)}</Text>
      </TextContent>
      <ProgressStepper
        aria-label={intl.formatMessage(messages.dataDetailsClusterData)}
        isVertical
        style={styles.stepper}
      >
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsIntegrationStatus)}
          icon={getProgressStepIcon(getProviderAvailability(provider).status)}
          id="step1"
          titleId="step1-title"
          variant={getProgressStepVariant(getProviderAvailability(provider).status)}
        >
          {intl.formatMessage(messages.dataDetailsIntegrationStatus)}
          <div style={styles.sourceLink}>
            <SourceLink provider={provider} showLabel={false} />
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsRetrieval)}
          icon={getProgressStepIcon(provider.status?.download?.state)}
          id="step1"
          titleId="step1-title"
          variant={getProgressStepVariant(provider.status?.download?.state)}
        >
          {intl.formatMessage(messages.dataDetailsRetrieval)}
          <div style={styles.description}>
            {formatDate(provider.status?.download?.end || provider.status?.download?.start)}
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsProcessing)}
          icon={getProgressStepIcon(provider.status?.processing?.state)}
          id="step2"
          titleId="step2-title"
          variant={getProgressStepVariant(provider.status?.processing?.state)}
        >
          {intl.formatMessage(messages.dataDetailsProcessing)}
          <div style={styles.description}>
            {formatDate(provider.status?.processing?.end || provider.status?.processing?.start)}
          </div>
        </ProgressStep>
      </ProgressStepper>
    </>
  );
};

export { ClusterData };
