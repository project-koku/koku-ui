import { Text, TextList, TextListItem, TextVariants } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { routes } from 'routes';
import { SourceLink } from 'routes/details/ocpBreakdown/providerDetails/components/sourceLink';
import { formatPath } from 'utils/paths';

import { styles } from '../clusterInfo.styles';

interface CloudIntegrationOwnProps {
  provider: Provider;
}

type CloudIntegrationProps = CloudIntegrationOwnProps;

const CloudIntegration: React.FC<CloudIntegrationProps> = ({ provider }: CloudIntegrationProps) => {
  const intl = useIntl();

  if (!provider) {
    return null;
  }

  return (
    <>
      <Text component={TextVariants.h3}>{intl.formatMessage(messages.cloudIntegration)}</Text>
      <TextList isPlain>
        <TextListItem>
          <SourceLink provider={provider} />
        </TextListItem>
        <TextListItem>
          {provider?.cost_models?.length ? (
            provider.cost_models.map(cm => (
              <>
                <span style={styles.spacingRight}>{intl.formatMessage(messages.costModel)}</span>
                <a href={`${formatPath(routes.costModel.basePath, true)}/${cm.uuid}`}>{cm.name}</a>
              </>
            ))
          ) : (
            <a href={formatPath(routes.settings.path, true)}>{intl.formatMessage(messages.assignCostModel)}</a>
          )}
        </TextListItem>
      </TextList>
    </>
  );
};

export { CloudIntegration };
