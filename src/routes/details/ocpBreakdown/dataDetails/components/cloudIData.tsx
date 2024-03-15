import { ProgressStep, ProgressStepper, Text, TextContent, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { styles } from 'routes/details/ocpBreakdown/dataDetails/dataDetails.styles';
import { formatDate } from 'routes/details/ocpBreakdown/dataDetails/utils/format';
import { getProgressStepIcon } from 'routes/details/ocpBreakdown/dataDetails/utils/icon';
import { getProviderAvailability } from 'routes/details/ocpBreakdown/dataDetails/utils/status';
import { getProgressStepVariant } from 'routes/details/ocpBreakdown/dataDetails/utils/variant';

interface CloudDataOwnProps {
  provider: Provider;
}

type CloudDataProps = CloudDataOwnProps;

const CloudIData: React.FC<CloudDataProps> = ({ provider }: CloudDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>{intl.formatMessage(messages.dataDetailsCloudData)}</Text>
      </TextContent>
      <ProgressStepper aria-label={intl.formatMessage(messages.dataDetailsCloudData)} isVertical style={styles.stepper}>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsCloudIntegrationStatus)}
          icon={getProgressStepIcon(getProviderAvailability(provider))}
          id="step1"
          titleId="step1-title"
          variant={getProgressStepVariant(getProviderAvailability(provider))}
        >
          {intl.formatMessage(messages.dataDetailsCloudIntegrationStatus)}
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsAvailability)}
          id="step1"
          titleId="step1-title"
          variant="success"
        >
          {intl.formatMessage(messages.dataDetailsAvailability)}
          <div style={styles.description}>{formatDate(provider.last_payload_received_at)}</div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsRetrieval)}
          icon={getProgressStepIcon(provider.status.download.state)}
          id="step2"
          titleId="step2-title"
          variant={getProgressStepVariant(provider.status.download.state)}
        >
          {intl.formatMessage(messages.dataDetailsRetrieval)}
          <div style={styles.description}>
            {formatDate(provider.status.download.end || provider.status.download.start)}
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsProcessing, { count: 3 })}
          icon={getProgressStepIcon(provider.status.processing.state)}
          id="step3"
          titleId="step3-title"
          variant={getProgressStepVariant(provider.status.processing.state)}
        >
          {intl.formatMessage(messages.dataDetailsProcessing)}
          <div style={styles.description}>
            {formatDate(provider.status.processing.end || provider.status.processing.start)}
          </div>
        </ProgressStep>
      </ProgressStepper>
    </>
  );
};

export { CloudIData };
