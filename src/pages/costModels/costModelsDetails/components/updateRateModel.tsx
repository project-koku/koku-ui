import { Alert, Button, Modal, Stack, StackItem } from '@patternfly/react-core';
import { CostModel, CostModelRequest } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import { Form } from 'components/forms/form';
import {
  canSubmit as isReadyForSubmit,
  genFormDataFromRate,
  hasDiff,
  mergeToRequest,
  RateForm,
  RateFormData,
  useRateData,
} from 'pages/costModels/components/rateForm/index';
import React from 'react';
import { Translation } from 'react-i18next';
import { WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';

interface UpdateRateModalBaseProps extends WithTranslation {
  rate: Rate;
  metricsHash: MetricHash;
  onClose: () => void;
  isOpen: boolean;
  isProcessing: boolean;
  updateError: string;
  onProceed: (rateFormData: RateFormData) => void;
}

const UpdateRateModalBase: React.FunctionComponent<UpdateRateModalBaseProps> = ({
  rate,
  metricsHash,
  onClose,
  isOpen,
  isProcessing,
  updateError,
  onProceed,
}) => {
  const rateFormData = useRateData(metricsHash, rate);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData]);
  const gotDiffs = React.useMemo(() => hasDiff(rate, rateFormData), [rateFormData]);
  React.useEffect(() => {
    rateFormData.reset(genFormDataFromRate(rate));
  }, [isOpen]);
  return (
    <Translation>
      {t => {
        return (
          <Modal
            title={t('cost_models_details.edit_rate')}
            isOpen={isOpen}
            onClose={onClose}
            variant="large"
            actions={[
              <Button
                key="proceed"
                variant="primary"
                onClick={() => {
                  onProceed(rateFormData);
                }}
                isDisabled={!canSubmit || isProcessing || !gotDiffs}
              >
                {t('cost_models_details.add_rate_modal.save')}
              </Button>,
              <Button key="cancel" variant="link" onClick={onClose} isDisabled={isProcessing}>
                {t('cost_models_details.add_rate_modal.cancel')}
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
      }}
    </Translation>
  );
};

export default connect(
  (state: RootState) => {
    const costModels = costModelsSelectors.costModels(state);
    let costModel: CostModel = null;
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
  },
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
      updateCostModel: (uuid: string, request: CostModelRequest) => {
        costModelsActions.updateCostModel(uuid, request, 'updateRate')(dispatch);
      },
    };
  },
  (stateProps, dispatchProps, ownProps: { index: number }) => {
    const { uuid } = stateProps.costModel;
    const rate =
      stateProps.costModel && stateProps.costModel.rates && stateProps.costModel.rates[ownProps.index]
        ? stateProps.costModel.rates[ownProps.index]
        : null;
    return {
      rate,
      metricsHash: stateProps.metricsHash,
      onClose: dispatchProps.onClose,
      isOpen: stateProps.isOpen,
      isProcessing: stateProps.isProcessing,
      updateError: stateProps.updateError,
      onProceed: (rateFormData: RateFormData) => {
        const costModelReq = mergeToRequest(stateProps.metricsHash, stateProps.costModel, rateFormData, ownProps.index);
        dispatchProps.updateCostModel(uuid, costModelReq);
      },
    };
  }
)(UpdateRateModalBase);
