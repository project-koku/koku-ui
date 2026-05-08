import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import type { DeleteRateHandle, EditRateHandle } from 'routes/settings/priceList/components/rates';
import { DeleteRate, EditRate } from 'routes/settings/priceList/components/rates';

interface RateActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  onDeleteSuccess?: () => void;
  onEdit?: (rates: Rate[]) => void;
  onEditSuccess?: () => void;
  priceList: PriceListData;
  rateIndex: number;
}

type RateActionsProps = RateActionsOwnProps;

const RateActions: React.FC<RateActionsProps> = ({
  canWrite,
  isDisabled,
  onClose,
  onDelete,
  onDeleteSuccess,
  onEdit,
  onEditSuccess,
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
        ref={editRateRef}
        onClose={onClose}
        onEdit={onEdit}
        onEditSuccess={onEditSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
      <DeleteRate
        ref={deleteRateRef}
        onClose={onClose}
        onDelete={onDelete}
        onDeleteSuccess={onDeleteSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
      <DropdownWrapper isKebab items={menuItems} position="right" />
    </>
  );
};

export { RateActions };
