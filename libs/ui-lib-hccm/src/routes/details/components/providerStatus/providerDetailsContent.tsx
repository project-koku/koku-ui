import type { ProviderType } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { ProviderBreakdownContent } from './providerBreakdownContent';
import { ProviderStatus } from './providerStatus';
import { styles } from './providerStatus.styles';

interface ProviderDetailsContentOwnProps {
  onBackClick?: () => void;
  onDetailsClick?: () => void;
  providerType: ProviderType;
}

type ProviderDetailsContentProps = ProviderDetailsContentOwnProps;

const ProviderDetailsContent: React.FC<ProviderDetailsContentProps> = ({
  onBackClick,
  onDetailsClick,
  providerType,
}: ProviderDetailsContentProps) => {
  const intl = useIntl();
  const [isBreakdown, setIsBreakdown] = useState(false);
  const [providerId, setProviderId] = useState<string>();

  const handleOnBackClick = () => {
    setProviderId(undefined);
    setIsBreakdown(false);
    if (onBackClick) {
      onBackClick();
    }
  };

  const handleOnDetailsClick = (id: string) => {
    setProviderId(id);
    setIsBreakdown(true);
    if (onDetailsClick) {
      onDetailsClick();
    }
  };

  return isBreakdown ? (
    <>
      <Button onClick={handleOnBackClick} style={styles.backButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.backToIntegrations)}
      </Button>
      <ProviderBreakdownContent providerId={providerId} providerType={providerType} />
    </>
  ) : (
    <ProviderStatus onClick={handleOnDetailsClick} providerType={providerType} showNotAvailable />
  );
};

export { ProviderDetailsContent };
