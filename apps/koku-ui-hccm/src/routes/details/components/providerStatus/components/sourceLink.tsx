import type { Provider } from 'api/providers';
import { isSettingsSourcesTabEnabled } from 'components/featureToggle/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { normalize } from 'routes/details/components/providerStatus/utils/normailize';
import { buildOnPremSettingsSourceHref } from 'routes/settings/settingsSourceSearch';
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
  let link: React.ReactNode;

  if (isSettingsSourcesTabEnabled) {
    if (provider.uuid) {
      link = <a href={buildOnPremSettingsSourceHref(formatPath(routes.settings.path, true), provider.uuid)}>{label}</a>;
    } else {
      link = label;
    }
  } else {
    const release = getReleasePath();
    link = <a href={`${release}/settings/integrations/detail/${provider.id}`}>{label}</a>;
  }

  return (
    <>
      {showLabel && (
        <span style={styles.spacingRight}>
          {intl.formatMessage(messages.source, { value: normalize(provider?.source_type) })}
        </span>
      )}
      {link}
    </>
  );
};

export { SourceLink };
