import type { Provider } from 'api/providers';
import { isOnPremEnabled, isOnpremSourcesEnabled } from 'components/featureToggle/featureToggle';
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
  // On-prem detail stays under Cost settings. The flag chooses which app renders it.
  // The category keeps the vendor list on Red Hat when that app reads the query (COST-7661).
  let href = `${getReleasePath()}/settings/integrations/detail/${provider.id}`;
  if (isOnPremEnabled) {
    href = `${formatPath(routes.integrationBreakdown.basePath, true)}/${provider.uuid}`;
    if (isOnpremSourcesEnabled) {
      href = `${href}?category=Red%20Hat`;
    }
  }

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
