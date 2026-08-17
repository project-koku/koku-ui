import type { SettingsData, SettingsRateData } from 'api/settings';
import messages from 'locales/messages';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import type { DeleteRateHandle } from 'routes/settings/exchangeRates/exchangeRate/components/delete';
import { DeleteRate } from 'routes/settings/exchangeRates/exchangeRate/components/delete';
import type { DuplicateRateHandle } from 'routes/settings/exchangeRates/exchangeRate/components/duplicate';
import { DuplicateRate } from 'routes/settings/exchangeRates/exchangeRate/components/duplicate';
import type { EditRateHandle } from 'routes/settings/exchangeRates/exchangeRate/components/edit';
import { EditRate } from 'routes/settings/exchangeRates/exchangeRate/components/edit';

interface RateActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (rate: SettingsRateData) => void;
  onDuplicate?: (rate: SettingsRateData) => void;
  onEdit?: (rate: SettingsRateData) => void;
  settings?: SettingsData[];
  uuid: string;
}

type RateActionsProps = RateActionsOwnProps;

const RateActions: React.FC<RateActionsProps> = ({
  canWrite,
  isDisabled,
  isDispatch,
  onClose,
  onDelete,
  onDuplicate,
  onEdit,
  settings,
  uuid,
}) => {
  const intl = useIntl();
  const editRateRef = useRef<EditRateHandle>(null);
  const deleteRateRef = useRef<DeleteRateHandle>(null);
  const duplicateRateRef = useRef<DuplicateRateHandle>(null);

  /** Bridges imperative refs without closing over them in objects built during render (react-hooks/refs). */
  const menuDispatchRef = useRef<{ delete: () => void; openDuplicate: () => void; openEdit: () => void }>({
    delete: () => {},
    openDuplicate: () => {},
    openEdit: () => {},
  });

  useLayoutEffect(() => {
    menuDispatchRef.current.delete = () => deleteRateRef.current?.delete();
    menuDispatchRef.current.openDuplicate = () => duplicateRateRef.current?.open();
    menuDispatchRef.current.openEdit = () => editRateRef.current?.open();
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
        onClick: () => menuDispatchRef.current.openDuplicate(),
        toString: () => intl.formatMessage(messages.duplicate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: () => menuDispatchRef.current.delete(),
        toString: () => intl.formatMessage(messages.remove),
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
        ref={editRateRef}
        settings={settings}
        uuid={uuid}
      />
      <DuplicateRate
        isDispatch={isDispatch}
        onClose={onClose}
        onDuplicate={onDuplicate}
        ref={duplicateRateRef}
        settings={settings}
        uuid={uuid}
      />
      <DeleteRate
        isDispatch={isDispatch}
        onClose={onClose}
        onDelete={onDelete}
        ref={deleteRateRef}
        settings={settings}
        uuid={uuid}
      />
      <DropdownWrapper isKebab items={menuItems} position="right" />
    </>
  );
};

export { RateActions };
