import type { CostModelRequest } from '@koku-ui/api/costModels';
import type { MetricHash } from '@koku-ui/api/metrics';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { metricsSelectors } from '../../../../store/metrics';
import { Form } from '../components/forms/form';
import {
  canSubmit as isReadyForSubmit,
  genFormDataFromRate,
  hasDiff,
  mergeToRequest,
  RateForm,
  useRateData,
} from '../components/rateForm';

interface UpdateRateModalOwnProps {
  index: number;
}

interface UpdateRateModalStateProps {
  costModel?: any;
  isOpen?: boolean;
  isProcessing?: boolean;
  metricsHash?: MetricHash;
  updateError?: string;
}

interface UpdateRateModalDispatchProps {
  onClose?: () => void;
  updateCostModel?: (uuid: string, request: CostModelRequest) => void;
}

type UpdateRateModalProps = UpdateRateModalOwnProps &
  UpdateRateModalStateProps &
  UpdateRateModalDispatchProps &
  WrappedComponentProps;

const UpdateRateModalBase: React.FC<UpdateRateModalProps> = ({
  costModel,
  index,
  intl = defaultIntl, // Default required for testing
  isOpen,
  isProcessing,
  metricsHash,
  onClose,
  updateCostModel,
  updateError,
}) => {
  const rate = costModel && costModel.rates && costModel.rates[index] ? costModel.rates[index] : null;
  const rateFormData: any = useRateData(metricsHash, rate, costModel.rates);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData]);
  const gotDiffs = React.useMemo(() => hasDiff(rate, rateFormData), [rateFormData]);

  const getCurrencyUnits = tiers => {
    if (tiers === null) {
      return 'USD';
    }
    if (tiers.tiered_rates) {
      for (const tier of tiers.tiered_rates) {
        if (tier.unit || tier.usage) {
          return tier.unit || tier.usage.unit;
        }
      }
    }
    if (tiers.tag_rates) {
      for (const tier of tiers.tag_rates.tag_values) {
        if (tier.unit) {
          return tier.unit;
        }
      }
    }
  };

  const onProceed = () => {
    const costModelReq = mergeToRequest(metricsHash, costModel, rateFormData, index);
    updateCostModel(costModel.uuid, costModelReq);
  };

  React.useEffect(() => {
    rateFormData.reset(
      genFormDataFromRate(
        rate,
        undefined,
        rate && rate.tag_rates
          ? costModel.rates.filter(
              orate =>
                orate.metric.name !== rate.metric.name ||
                orate.cost_type !== rate.cost_type ||
                (orate.tag_rates && rate.tag_rates && orate.tag_rates.tag_key !== rate.tag_rates.tag_key)
            )
          : costModel.rates
      )
    );
  }, [isOpen]);

  return (
    <Modal
      aria-label={intl.formatMessage(messages.priceListEditRate)}
      className="costManagement"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.large}
    >
      <ModalHeader title={intl.formatMessage(messages.priceListEditRate)} />
      <ModalBody>
        <Stack hasGutter>
          {updateError && (
            <StackItem>
              <Alert variant="danger" title={`${updateError}`} />
            </StackItem>
          )}
          <StackItem>
            <Form>
              <RateForm currencyUnits={getCurrencyUnits(rate)} metricsHash={metricsHash} rateFormData={rateFormData} />
            </Form>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          key="proceed"
          variant="primary"
          onClick={onProceed}
          isDisabled={isProcessing || !canSubmit || !gotDiffs}
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button key="cancel" variant="link" onClick={onClose} isDisabled={isProcessing}>
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = createMapStateToProps<UpdateRateModalOwnProps, UpdateRateModalStateProps>(state => {
  const costModels = costModelsSelectors.costModels(state);
  let costModel = null;
  if (costModels.length > 0) {
    costModel = costModels[0];
  }
  return {
    costModel,
    isOpen: (costModelsSelectors.isDialogOpen(state)('rate') as any).updateRate,
    updateError: costModelsSelectors.updateError(state),
    isProcessing: costModelsSelectors.updateProcessing(state),
    metricsHash: metricsSelectors.metrics(state),
  };
});

const mapDispatchToProps = (dispatch): UpdateRateModalDispatchProps => {
  return {
    onClose: () => {
      dispatch(
        costModelsActions.setCostModelDialog({
          name: 'updateRate',
          isOpen: false,
        })
      );
    },
    updateCostModel: (uuid: string, request: CostModelRequest) =>
      costModelsActions.updateCostModel(uuid, request, 'updateRate')(dispatch),
  };
};

const UpdateRateModal = injectIntl(connect(mapStateToProps, mapDispatchToProps)(UpdateRateModalBase));

export default UpdateRateModal;
