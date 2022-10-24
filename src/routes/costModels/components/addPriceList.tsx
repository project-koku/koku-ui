import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { MetricHash } from 'api/metrics';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { RateFormData } from 'routes/costModels/components/rateForm';
import { canSubmit as isReadyForSubmit, RateForm, useRateData } from 'routes/costModels/components/rateForm';
import { CostModelContext } from 'routes/costModels/createCostModelWizard/context';

interface AddPriceListOwnProps {
  cancel: () => void;
  currencyUnits?: string;
  metricsHash: MetricHash;
  submitRate: (data: RateFormData) => void;
}

type AddPriceListProps = AddPriceListOwnProps & WrappedComponentProps;

const AddPriceList: React.FC<AddPriceListProps> = ({
  cancel,
  currencyUnits,
  intl = defaultIntl, // Default required for testing
  metricsHash,
  submitRate,
}) => {
  const { tiers } = React.useContext(CostModelContext);
  const rateFormData = useRateData(metricsHash, undefined, tiers);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.costModelsWizardCreatePriceList)}
        </Title>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.h3}>{intl.formatMessage(messages.costModelsWizardPriceListMetric)}</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Form>
          <RateForm currencyUnits={currencyUnits} metricsHash={metricsHash} rateFormData={rateFormData} />
        </Form>
      </StackItem>
      <StackItem>
        <ActionGroup>
          <Button variant={ButtonVariant.primary} isDisabled={!canSubmit} onClick={() => submitRate(rateFormData)}>
            {intl.formatMessage(messages.createRate)}
          </Button>
          <Button variant={ButtonVariant.link} onClick={cancel}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ActionGroup>
      </StackItem>
    </Stack>
  );
};

export default injectIntl(AddPriceList);
