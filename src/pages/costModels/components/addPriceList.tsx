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
import { MetricHash } from 'api/metrics';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import {
  canSubmit as isReadyForSubmit,
  RateForm,
  RateFormData,
  useRateData,
} from 'pages/costModels/components/rateForm';
import { CostModelContext } from 'pages/costModels/createCostModelWizard/context';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface AddPriceListOwnProps {
  metricsHash: MetricHash;
  submitRate: (data: RateFormData) => void;
  cancel: () => void;
}

type AddPriceListProps = AddPriceListOwnProps & WrappedComponentProps;

const AddPriceList: React.FunctionComponent<AddPriceListProps> = ({
  intl = defaultIntl, // Default required for testing
  submitRate,
  cancel,
  metricsHash,
}) => {
  const { tiers } = React.useContext(CostModelContext);
  const rateFormData = useRateData(metricsHash, undefined, tiers);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.CostModelsWizardCreatePriceList)}
        </Title>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.h6}>{intl.formatMessage(messages.CostModelsWizardPriceListMetric)}</Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Form>
          <RateForm metricsHash={metricsHash} rateFormData={rateFormData} />
        </Form>
      </StackItem>
      <StackItem>
        <ActionGroup>
          <Button variant={ButtonVariant.primary} isDisabled={!canSubmit} onClick={() => submitRate(rateFormData)}>
            {intl.formatMessage(messages.CreateRate)}
          </Button>
          <Button variant={ButtonVariant.link} onClick={cancel}>
            {intl.formatMessage(messages.Cancel)}
          </Button>
        </ActionGroup>
      </StackItem>
    </Stack>
  );
};

export default injectIntl(AddPriceList);
