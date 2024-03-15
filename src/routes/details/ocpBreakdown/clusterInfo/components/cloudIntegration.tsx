import { Text, TextList, TextListItem, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { styles } from 'routes/details/ocpBreakdown/clusterInfo/clusterInfo.styles';
import { formatPath, getReleasePath } from 'utils/paths';

interface CloudIntegrationOwnProps {
  provider: Provider;
}

type CloudIntegrationProps = CloudIntegrationOwnProps;

const CloudIntegration: React.FC<CloudIntegrationProps> = ({ provider }: CloudIntegrationProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  const release = getReleasePath();

  return (
    <>
      <Text component={TextVariants.h3}>{intl.formatMessage(messages.cloudIntegration)}</Text>
      <TextList isPlain>
        <TextListItem>
          <span style={styles.spacingRight}>
            {intl.formatMessage(messages.source, { value: provider?.source_type?.toLowerCase() })}
          </span>
          <a href={`${release}/settings/integrations/detail/${provider?.id}`}>{provider?.name}</a>
        </TextListItem>
        {provider?.cost_models?.length === 0 && (
          <TextListItem>
            <a href={formatPath(routes.settings.path)}>{intl.formatMessage(messages.assignCostModel)}</a>
          </TextListItem>
        )}
      </TextList>
    </>
  );
};

export { CloudIntegration };
