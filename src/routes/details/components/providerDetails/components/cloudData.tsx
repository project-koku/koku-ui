import { Content, ContentVariants, ProgressStep, ProgressStepper } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { SourceLink } from 'routes/details/components/providerDetails/components/sourceLink';
import { formatDate } from 'routes/details/components/providerDetails/utils/format';
import { getProgressStepIcon } from 'routes/details/components/providerDetails/utils/icon';
import { getProviderAvailability } from 'routes/details/components/providerDetails/utils/status';
import { getProgressStepVariant } from 'routes/details/components/providerDetails/utils/variant';

import { styles } from './component.styles';

interface CloudDataOwnProps {
  provider: Provider;
}

type CloudDataProps = CloudDataOwnProps;

const CloudData: React.FC<CloudDataProps> = ({ provider }: CloudDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  return (
    <>
      <Content>
        <Content component={ContentVariants.h3}>{intl.formatMessage(messages.dataDetailsCloudData)}</Content>
      </Content>
      <ProgressStepper aria-label={intl.formatMessage(messages.dataDetailsCloudData)} isVertical style={styles.stepper}>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsCloudIntegrationStatus)}
          icon={getProgressStepIcon(getProviderAvailability(provider).status)}
          id="step1"
          titleId="step1-title"
          variant={getProgressStepVariant(getProviderAvailability(provider).status)}
        >
          {intl.formatMessage(messages.dataDetailsCloudIntegrationStatus)}
          <div style={styles.sourceLink}>
            <SourceLink provider={provider} showLabel={false} />
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsAvailability)}
          id="step2"
          titleId="step2-title"
          variant="success"
        >
          {intl.formatMessage(messages.dataDetailsAvailability)}
          <div style={styles.description}>{formatDate(provider.last_payload_received_at)}</div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsRetrieval)}
          icon={getProgressStepIcon(provider.status?.download?.state)}
          id="step3"
          titleId="step3-title"
          variant={getProgressStepVariant(provider.status?.download?.state)}
        >
          {intl.formatMessage(messages.dataDetailsRetrieval)}
          <div style={styles.description}>
            {formatDate(provider.status?.download?.end || provider.status?.download?.start)}
          </div>
        </ProgressStep>
        <ProgressStep
          aria-label={intl.formatMessage(messages.dataDetailsProcessing, { count: 3 })}
          icon={getProgressStepIcon(provider.status?.processing?.state)}
          id="step4"
          titleId="step4-title"
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

export { CloudData };
