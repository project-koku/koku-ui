import type { Provider } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Content, ContentVariants, ProgressStep, ProgressStepper } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

import { formatDate } from '../utils/format';
import { getProgressStepIcon } from '../utils/icon';
import { getProviderAvailability } from '../utils/status';
import { getProgressStepVariant } from '../utils/variant';
import { styles } from './component.styles';
import { SourceLink } from './sourceLink';

interface CloudDataOwnProps {
  provider: Provider;
}

type CloudDataProps = CloudDataOwnProps;

const CloudData: React.FC<CloudDataProps> = ({ provider }: CloudDataProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  // Note: The sources API returns two types for last_payload_received_at. We're expecting a date string, but a boolean
  // may be returned instead. See https://issues.redhat.com/browse/COST-5750

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
          variant={typeof provider.last_payload_received_at === 'string' ? 'success' : 'default'}
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
