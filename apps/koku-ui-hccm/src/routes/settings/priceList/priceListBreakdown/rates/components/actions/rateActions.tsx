import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import type { DeleteRateHandle } from 'routes/settings/priceList/priceListBreakdown/rates/components/delete';
import { DeleteRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/delete';
import type { EditRateHandle } from 'routes/settings/priceList/priceListBreakdown/rates/components/edit';
import { EditRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/edit';

interface RateActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
  onSuccess?: () => void;
  priceList: PriceListData;
  rateIndex: number;
}

type RateActionsProps = RateActionsOwnProps;

const RateActions: React.FC<RateActionsProps> = ({
  canWrite,
  isDisabled,
  isDispatch,
  onClose,
  onDelete,
  onEdit,
  onSuccess,
  priceList,
  rateIndex,
}) => {
  const intl = useIntl();
  const editRateRef = useRef<EditRateHandle>(null);
  const deleteRateRef = useRef<DeleteRateHandle>(null);

  /** Bridges imperative refs without closing over them in objects built during render (react-hooks/refs). */
  const menuDispatchRef = useRef<{ openDelete: () => void; openEdit: () => void }>({
    openDelete: () => {},
    openEdit: () => {},
  });

  useLayoutEffect(() => {
    menuDispatchRef.current.openEdit = () => editRateRef.current?.open();
    menuDispatchRef.current.openDelete = () => deleteRateRef.current?.open();
  });

  const menuItems: DropdownWrapperItem[] = useMemo(
    () => [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: () => menuDispatchRef.current.openEdit(),
        toString: () => intl.formatMessage(messages.priceListEditRate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: () => menuDispatchRef.current.openDelete(),
        toString: () => intl.formatMessage(messages.delete),
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
      <EditRate
        isDispatch={isDispatch}
        onClose={onClose}
        onEdit={onEdit}
        onSuccess={onSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
        ref={editRateRef}
      />
      <DeleteRate
        isDispatch={isDispatch}
        onClose={onClose}
        onDelete={onDelete}
        onSuccess={onSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
        ref={deleteRateRef}
      />
      <DropdownWrapper isKebab items={menuItems} position="right" />
    </>
  );
};

export { RateActions };
