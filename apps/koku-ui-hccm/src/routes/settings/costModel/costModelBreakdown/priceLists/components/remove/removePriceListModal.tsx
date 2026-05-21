import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { ReviewChangeModal } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/review';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';

interface RemovePriceListModalOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  selectedItems: PriceListData[];
}

interface RemovePriceListModalStateProps {
  costModelsError: AxiosError;
  costModelsStatus: FetchStatus;
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

  const { costModelsError, costModelsStatus } = useMapToProps();

  // Handlers

  const handleOnRemove = () => {
    if (costModelsStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);

        const newPriceLists = costModel?.price_lists?.filter(val => {
          return !selectedItems.find(item => item.uuid === val.uuid);
        });
        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            price_lists: newPriceLists,
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
    if (isFinish && costModelsStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsError) {
        onRemove?.(selectedItems);
      }
    }
  }, [isFinish, costModel, costModelsError, costModelsStatus, onRemove]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return <ReviewChangeModal costModel={costModel} isOpen={isOpen} onClose={onClose} onConfirm={handleOnRemove} />;
};

const useMapToProps = (): RemovePriceListModalStateProps => {
  const costModelsError = useSelector((state: RootState) => state.costModels.update.error);
  const costModelsStatus = useSelector((state: RootState) => state.costModels.update.status);

  return {
    costModelsError,
    costModelsStatus,
  };
};

export { RemovePriceListModal };
