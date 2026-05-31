import { Content, ContentVariants, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { IntegrationContentHandle } from 'routes/settings/costModels/costModelBreakdown/integrations/components';
import { IntegrationContent } from 'routes/settings/costModels/costModelBreakdown/integrations/components';

interface IntegrationOwnProps {
  canWrite?: boolean;
  contentRef?: React.RefObject<IntegrationContentHandle>;
  onAdd?: (sources: Provider[]) => void;
  sources?: Provider[];
  sourceType: string;
}

type IntegrationProps = IntegrationOwnProps;

const Integration: React.FC<IntegrationProps> = ({
  canWrite,
  contentRef,
  onAdd,
  sources,
  sourceType,
}: IntegrationProps) => {
  const intl = useIntl();

  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.costModelsWizardSourceTitle)}
        </Title>
      </StackItem>
      <StackItem>
        <Content>
          <Content component="p">{intl.formatMessage(messages.costModelsWizardSourceSubtitle)}</Content>
        </Content>
      </StackItem>
      <StackItem>
        <Content>
          <Content component={ContentVariants.h3}>
            {intl.formatMessage(messages.costModelsWizardSourceCaption, {
              value: sourceType.toLowerCase(),
            })}
          </Content>
        </Content>
      </StackItem>
      <StackItem>
        <IntegrationContent
          canWrite={canWrite}
          onAdd={onAdd}
          ref={contentRef}
          sources={sources}
          sourceType={sourceType}
        />
      </StackItem>
    </Stack>
  );
};

export { Integration };
