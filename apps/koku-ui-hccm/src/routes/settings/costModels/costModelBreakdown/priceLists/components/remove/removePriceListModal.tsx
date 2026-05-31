import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import { ReviewChangeModal } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/review';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface RemovePriceListModalOwnProps {
  costModel?: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  selectedItems: PriceListData[];
}

interface RemovePriceListModalStateProps {
  costModelsUpdateError: AxiosError;
  costModelsUpdateStatus: FetchStatus;
}

type RemovePriceListModalProps = RemovePriceListModalOwnProps;

const RemovePriceListModal: React.FC<RemovePriceListModalProps> = ({
  costModel,
  isDispatch = true,
  isOpen = false,
  onClose,
  onRemove,
  selectedItems,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const [isFinish, setIsFinish] = useState(false);

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnRemove = () => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      if (costModel?.uuid && isDispatch) {
        setIsFinish(true);

        const newPriceLists = costModel?.price_lists?.filter(
          item => !(selectedItems ?? []).some(selected => selected.uuid === item.uuid)
        );
        const uuids = newPriceLists?.map(item => item.uuid) ?? [];

        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            price_lists: undefined,
            price_list_uuids: uuids,
            source_type: getSourceType(costModel?.source_type),
          })
        );
      } else {
        onRemove?.(selectedItems);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onRemove?.(selectedItems);
      }
    }
  }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onRemove, selectedItems]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return <ReviewChangeModal costModel={costModel} isOpen={isOpen} onClose={onClose} onConfirm={handleOnRemove} />;
};

const useMapToProps = (): RemovePriceListModalStateProps => {
  const costModelsUpdateError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateError(state)
  );
  const costModelsUpdateStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateStatus(state)
  );

  return {
    costModelsUpdateError,
    costModelsUpdateStatus,
  };
};

export { RemovePriceListModal };
