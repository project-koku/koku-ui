import {
  ActionGroup,
  Button,
  ButtonVariant,
  Content,
  ContentVariants,
  Form,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { MetricHash } from 'api/metrics';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { RateFormData } from 'routes/settings/costModels/components/rateForm';
import { canSubmit as isReadyForSubmit, RateForm, useRateData } from 'routes/settings/costModels/components/rateForm';
import { CostModelContext } from 'routes/settings/costModels/costModelWizard/context';

interface AddPriceListOwnProps {
  cancel: () => void;
  currencyUnits?: string;
  gpuModels?: any;
  gpuVendors?: any;
  metricsHash: MetricHash;
  submitRate: (data: RateFormData) => void;
}

type AddPriceListProps = AddPriceListOwnProps & WrappedComponentProps;

const AddPriceList: React.FC<AddPriceListProps> = ({
  cancel,
  currencyUnits,
  gpuModels,
  gpuVendors,
  intl = defaultIntl, // Default required for testing
  metricsHash,
  submitRate,
}) => {
  const { tiers } = React.useContext(CostModelContext);
  const rateFormData: any = useRateData(metricsHash, undefined, tiers);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.costModelsWizardCreatePriceList)}
        </Title>
      </StackItem>
      <StackItem>
        <Content>
          <Content component={ContentVariants.h3}>
            {intl.formatMessage(messages.costModelsWizardPriceListMetric)}
          </Content>
        </Content>
      </StackItem>
      <StackItem>
        <Form>
          <RateForm
            currencyUnits={currencyUnits}
            gpuModels={gpuModels}
            gpuVendors={gpuVendors}
            metricsHash={metricsHash}
            rateFormData={rateFormData}
          />
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
