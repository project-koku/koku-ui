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
      <Content>
        <Content component={ContentVariants.h3}>{intl.formatMessage(messages.dataDetailsClusterData)}</Content>
      </Content>
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
