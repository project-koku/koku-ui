import { Alert, Button, ButtonVariant, Form, Modal } from '@patternfly/react-core';
import { CostModelRequest } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import messages from 'locales/messages';
import {
  canSubmit as isReadyForSubmit,
  mergeToRequest,
  RateForm,
  useRateData,
} from 'pages/costModels/components/rateForm';
import { initialRateFormData } from 'pages/costModels/components/rateForm/utils';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';

interface AddRateModalBaseOwnProps {
  isOpen?: boolean;
  isProcessing?: boolean;
  metricsHash?: MetricHash;
  onClose?: () => void;
  updateError?: string;
}

interface AddRateModalBaseStateProps {
  costModel?: any;
  updateCostModel?: (uuid: string, request: CostModelRequest) => void;
}

type AddRateModalBaseProps = AddRateModalBaseOwnProps & AddRateModalBaseStateProps & WrappedComponentProps;

export const AddRateModalBase: React.FunctionComponent<AddRateModalBaseProps> = ({
  costModel,
  intl,
  isOpen,
  isProcessing,
  metricsHash,
  onClose,
  updateCostModel,
  updateError,
}) => {
  const rateFormData = useRateData(metricsHash);
  const canSubmit = React.useMemo(() => isReadyForSubmit(rateFormData), [rateFormData.errors, rateFormData.rateKind]);
  const onProceed = () => {
    const costModelReq = mergeToRequest(metricsHash, costModel, rateFormData);
    updateCostModel(costModel.uuid, costModelReq);
  };

  React.useEffect(() => {
    rateFormData.reset({ ...initialRateFormData, otherTiers: costModel.rates });
  }, [isOpen]);

  return (
    <Modal
      title={intl.formatMessage(messages.PriceListAddRate)}
      isOpen={isOpen}
      onClose={onClose}
      variant="large"
      actions={[
        <Button
          key="add-rate"
          variant={ButtonVariant.primary}
          isDisabled={!canSubmit || isProcessing}
          onClick={onProceed}
        >
          {intl.formatMessage(messages.PriceListAddRate)}
        </Button>,
        <Button key="cancel" variant={ButtonVariant.link} isDisabled={isProcessing} onClick={onClose}>
          {intl.formatMessage(messages.Cancel)}
        </Button>,
      ]}
    >
      <Form>
        {updateError && <Alert variant="danger" title={`${updateError}`} />}
        <RateForm currencyUnits={costModel.currency} metricsHash={metricsHash} rateFormData={rateFormData} />
      </Form>
    </Modal>
  );
};

export default injectIntl(
  connect(
    createMapStateToProps<AddRateModalBaseOwnProps, AddRateModalBaseStateProps>(state => {
      const costModels = costModelsSelectors.costModels(state);
      let costModel = null;
      if (costModels.length > 0) {
        costModel = costModels[0];
      }
      return {
        costModel,
        isOpen: costModelsSelectors.isDialogOpen(state)('rate').addRate,
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
              name: 'addRate',
              isOpen: false,
            })
          );
        },
        updateCostModel: (uuid: string, request: CostModelRequest) =>
          costModelsActions.updateCostModel(uuid, request, 'addRate')(dispatch),
      };
    }
  )(AddRateModalBase)
);
