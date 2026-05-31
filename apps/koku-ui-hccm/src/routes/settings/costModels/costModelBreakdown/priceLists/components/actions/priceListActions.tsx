import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import type { RemovePriceListHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/remove';
import { RemovePriceList } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/remove';

interface PriceListActionsOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  selectedItems: PriceListData[];
}

type PriceListActionsProps = PriceListActionsOwnProps;

const PriceListActions: React.FC<PriceListActionsProps> = ({
  canWrite,
  costModel,
  isDisabled,
  isDispatch,
  onClose,
  onRemove,
  selectedItems,
}) => {
  const intl = useIntl();
  const removePriceListRef = useRef<RemovePriceListHandle>(null);

  /** Bridges imperative refs without closing over them in objects built during render (react-hooks/refs). */
  const menuDispatchRef = useRef<{ openRemove: () => void }>({
    openRemove: () => {},
  });

  useLayoutEffect(() => {
    menuDispatchRef.current.openRemove = () => removePriceListRef.current?.open();
  });

  const menuItems: DropdownWrapperItem[] = useMemo(
    () => [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: () => menuDispatchRef.current.openRemove(),
        toString: () => intl.formatMessage(messages.unassignSelected),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
    ],
    [canWrite, intl, isDisabled]
  );

  return (
    <>
      <RemovePriceList
        costModel={costModel}
        isDispatch={isDispatch}
        onClose={onClose}
        onRemove={onRemove}
        ref={removePriceListRef}
        selectedItems={selectedItems}
      />
      <DropdownWrapper isKebab items={menuItems} position="right" />
    </>
  );
};

export { PriceListActions };
