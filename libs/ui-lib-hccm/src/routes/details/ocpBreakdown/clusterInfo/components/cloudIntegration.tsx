import type { Provider } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Content, ContentVariants } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

import { routes } from '../../../../../routes';
import { formatPath } from '../../../../../utils/paths';
import { SourceLink } from '../../../components/providerStatus/components/sourceLink';
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
      <Content component={ContentVariants.h3}>{intl.formatMessage(messages.cloudIntegration)}</Content>
      <Content component="ul" isPlainList>
        <Content component="li">
          <SourceLink provider={provider} />
        </Content>
        <Content component="li">
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
        </Content>
      </Content>
    </>
  );
};

export { CloudIntegration };
