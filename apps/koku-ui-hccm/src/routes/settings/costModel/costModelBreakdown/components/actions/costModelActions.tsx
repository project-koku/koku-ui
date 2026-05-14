import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import type { DeleteCostModelHandle } from 'routes/settings/costModel/costModelBreakdown/components/delete';
import { DeleteCostModel } from 'routes/settings/costModel/costModelBreakdown/components/delete';
import type { EditCostModelHandle } from 'routes/settings/costModel/costModelBreakdown/components/edit';
import { EditCostModel } from 'routes/settings/costModel/costModelBreakdown/components/edit';

interface CostModelActionsOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (costModel: CostModel) => void;
  onEdit?: (costModel: CostModel) => void;
}

type CostModelActionsProps = CostModelActionsOwnProps;

const CostModelActions: React.FC<CostModelActionsProps> = ({
  canWrite,
  costModel,
  isDisabled,
  isDispatch,
  onClose,
  onDelete,
  onEdit,
}) => {
  const intl = useIntl();
  const editCostModelRef = useRef<EditCostModelHandle>(null);
  const deleteCostModelRef = useRef<DeleteCostModelHandle>(null);

  /** Bridges imperative refs without closing over them in objects built during render (react-hooks/refs). */
  const menuDispatchRef = useRef<{ openDelete: () => void; openEdit: () => void }>({
    openDelete: () => {},
    openEdit: () => {},
  });

  useLayoutEffect(() => {
    menuDispatchRef.current.openEdit = () => editCostModelRef.current?.open();
    menuDispatchRef.current.openDelete = () => deleteCostModelRef.current?.open();
  });

  const menuItems: DropdownWrapperItem[] = useMemo(
    () => [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: () => menuDispatchRef.current.openEdit(),
        toString: () => intl.formatMessage(messages.edit),
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
      <EditCostModel
        costModel={costModel}
        isDispatch={isDispatch}
        onClose={onClose}
        onSave={onEdit}
        ref={editCostModelRef}
      />
      <DeleteCostModel
        costModel={costModel}
        isDispatch={isDispatch}
        onClose={onClose}
        onDelete={onDelete}
        ref={deleteCostModelRef}
      />
      <DropdownWrapper isKebab items={menuItems} position="right" />
    </>
  );
};

export { CostModelActions };
