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
import {
  canSubmit as isReadyForSubmit,
  RateForm,
  RateFormData,
  useRateData,
} from 'pages/costModels/components/rateForm';
import { CostModelContext } from 'pages/costModels/createCostModelWizard/context';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AddPriceListProps {
  metricsHash: MetricHash;
  submitRate: (data: RateFormData) => void;
  cancel: () => void;
}

const AddPriceList: React.FunctionComponent<AddPriceListProps> = ({ submitRate, cancel, metricsHash }) => {
  const { tiers } = React.useContext(CostModelContext);
  const { t } = useTranslation();
  const rateFormData = useRateData(metricsHash, undefined, tiers);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {t('cost_models_wizard.price_list.title')}
        </Title>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.h6}>{t('cost_models_wizard.price_list.sub_title_add')}</Text>
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
            {t('cost_models_wizard.price_list.create_rate')}
          </Button>
          <Button variant={ButtonVariant.link} onClick={cancel}>
            {t('cost_models_wizard.price_list.cancel')}
          </Button>
        </ActionGroup>
      </StackItem>
    </Stack>
  );
};

export default AddPriceList;
