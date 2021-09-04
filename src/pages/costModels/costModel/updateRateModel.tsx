import { Alert, Button, Modal, Stack, StackItem } from '@patternfly/react-core';
import { CostModelRequest } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Form } from 'components/forms/form';
import messages from 'locales/messages';
import {
  canSubmit as isReadyForSubmit,
  genFormDataFromRate,
  hasDiff,
  mergeToRequest,
  RateForm,
  useRateData,
} from 'pages/costModels/components/rateForm';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { intl as defaultIntl } from 'components/i18n';

interface UpdateRateModaBaseOwnProps {
  index: number;
  isOpen?: boolean;
  isProcessing?: boolean;
  metricsHash?: MetricHash;
  onClose?: () => void;
  updateError?: string;
}

interface UpdateRateModaBaseStateProps {
  costModel?: any;
  updateCostModel?: (uuid: string, request: CostModelRequest) => void;
}

type UpdateRateModalBaseProps = UpdateRateModaBaseOwnProps & UpdateRateModaBaseStateProps & WrappedComponentProps;

const UpdateRateModalBase: React.FunctionComponent<UpdateRateModalBaseProps> = ({
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
  const rateFormData = useRateData(metricsHash, rate, costModel.rates);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData]);
  const gotDiffs = React.useMemo(() => hasDiff(rate, rateFormData), [rateFormData]);

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
                orate.tag_rates.tag_key !== rate.tag_rates.tag_key
            )
          : costModel.rates
      )
    );
  }, [isOpen]);
  return (
    <Modal
      title={intl.formatMessage(messages.PriceListEditRate)}
      isOpen={isOpen}
      onClose={onClose}
      variant="large"
      actions={[
        <Button
          key="proceed"
          variant="primary"
          onClick={onProceed}
          isDisabled={!canSubmit || isProcessing || !gotDiffs}
        >
          {intl.formatMessage(messages.Save)}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose} isDisabled={isProcessing}>
          {intl.formatMessage(messages.Cancel)}
        </Button>,
      ]}
    >
      <Stack hasGutter>
        {updateError && (
          <StackItem>
            <Alert variant="danger" title={`${updateError}`} />
          </StackItem>
        )}
        <StackItem>
          <Form>
            <RateForm metricsHash={metricsHash} rateFormData={rateFormData} />
          </Form>
        </StackItem>
      </Stack>
    </Modal>
  );
};

export default injectIntl(
  connect(
    createMapStateToProps<UpdateRateModaBaseOwnProps, UpdateRateModaBaseStateProps>(state => {
      const costModels = costModelsSelectors.costModels(state);
      let costModel = null;
      if (costModels.length > 0) {
        costModel = costModels[0];
      }
      return {
        costModel,
        isOpen: costModelsSelectors.isDialogOpen(state)('rate').updateRate,
        updateError: costModelsSelectors.updateError(state),
        isProcessing: costModelsSelectors.updateProcessing(state),
        metricsHash: metricsSelectors.metrics(state),
      };
    }),
    dispatch => {
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
    }
  )(UpdateRateModalBase)
);
