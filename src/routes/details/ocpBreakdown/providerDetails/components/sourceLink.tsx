import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { normalize } from 'routes/details/ocpBreakdown/providerDetails/utils/normailize';
import { getReleasePath } from 'utils/paths';

import { styles } from './sourceLink.styles';

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

  const release = getReleasePath();

  return (
    <>
      {showLabel && (
        <span style={styles.spacingRight}>
          {intl.formatMessage(messages.source, { value: normalize(provider?.source_type) })}
        </span>
      )}
      <a href={`${release}/settings/integrations/detail/${provider?.id}`}>{provider?.name || provider?.uuid}</a>
    </>
  );
};

export { SourceLink };
