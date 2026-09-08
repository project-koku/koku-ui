import type { Provider } from 'api/providers';
import { isOnPremEnabled } from 'components/featureToggle/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { normalize } from 'routes/details/components/providerStatus/utils/normailize';
import { formatPath, getReleasePath } from 'utils/paths';

import { styles } from './component.styles';

interface SourceLinkOwnProps {
  provider: Provider;
  showLabel?: boolean;
}

type SourceLinkProps = SourceLinkOwnProps;

const SourceLink: React.FC<SourceLinkProps> = ({ provider, showLabel = true }: SourceLinkProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  const label = provider.name || provider.uuid;
  // On-prem: SaaS /settings/integrations/detail/<id> is outside the plugin mount (COST-7661 blank page).
  // Deep-link into a specific source is deferred to COST-7441; land on Settings (Sources tab available).
  const href = isOnPremEnabled
    ? formatPath(routes.settings.path, true)
    : `${getReleasePath()}/settings/integrations/detail/${provider.id}`;

  return (
    <>
      {showLabel && (
        <span style={styles.spacingRight}>
          {intl.formatMessage(messages.source, { value: normalize(provider?.source_type) })}
        </span>
      )}
      <a href={href}>{label}</a>
    </>
  );
};

export { SourceLink };
