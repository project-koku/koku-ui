import 'routes/components/dataTable/dataTable.scss';

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { Settings } from 'api/settings';
import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { ExpandableTable } from 'routes/components/dataTable';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { styles } from './tagMappings.styles';

interface TagMappingsTableOwnProps {
  canWrite?: boolean;
  filterBy?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
  onDelete();
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  settings: Settings;
}

export interface TagMappingsTableStateProps {
  settingsUpdateError?: AxiosError;
  settingsUpdateStatus?: FetchStatus;
}

type TagMappingsTableProps = TagMappingsTableOwnProps;

const TagMappingsTable: React.FC<TagMappingsTableProps> = ({
  canWrite,
  filterBy,
  isDisabled,
  isLoading,
  onDelete,
  onSort,
  orderBy,
  settings,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const { settingsUpdateError, settingsUpdateStatus } = useMapToProps();

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const getChildActions = (item: SettingsData) => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button
        aria-label={intl.formatMessage(messages.delete)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnDeleteChild(item)}
        size="sm"
        variant={ButtonVariant.plain}
      >
        <MinusCircleIcon />
      </Button>
    );
  };

  const handleOnDeleteChild = (item: SettingsData) => {
    if (settingsUpdateStatus !== FetchStatus.inProgress) {
      dispatch(
        settingsActions.updateSettings(SettingsType.tagsMappingsChildRemove, {
          ids: [item.uuid],
        })
      );
    }
  };

  // const handleOnDeleteParent = (item: SettingsData) => {
  //   if (settingsUpdateStatus !== FetchStatus.inProgress) {
  //     dispatch(
  //       settingsActions.updateSettings(SettingsType.tagsMappingsParentRemove, {
  //         ids: [item.uuid],
  //       })
  //     );
  //   }
  // };

  const initDatum = () => {
    if (!settings) {
      return;
    }

    const newRows = [];
    const tagMappings = settings?.data ? (settings.data as any) : [];

    const newColumns = [
      {
        name: '',
      },
      {
        orderBy: 'parent',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' }),
        ...(tagMappings.length && { isSortable: true }),
      },
      {
        orderBy: 'source_type',
        name: intl.formatMessage(messages.sourceType),
        ...(tagMappings.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    tagMappings.map(item => {
      const parent = item.parent;
      newRows.push({
        cells: [
          {}, // Empty cell for expand toggle
          {
            value: parent.key ? parent.key : '',
          },
          {
            value: intl.formatMessage(messages.sourceTypes, { value: parent?.source_type?.toLowerCase() }),
          },
          {
            value: 'Test...',
          },
        ],
        children: parent.children.map(child => {
          return {
            cells: [
              {}, // Empty cell for expand toggle
              {
                value: child.key ? child.key : '',
                style: styles.expandableRowContent,
              },
              {
                value: intl.formatMessage(messages.sourceTypes, { value: child?.source_type?.toLowerCase() }),
                style: styles.expandableRowContent,
              },
              {
                value: getChildActions(child),
              },
            ],
            item: child,
          };
        }),
        item: parent,
      });
    });

    const filteredColumns = (newColumns as any[]).filter(column => !column.hidden);
    const filteredRows = newRows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    setColumns(filteredColumns);
    setRows(filteredRows);
  };

  useEffect(() => {
    initDatum();
  }, [settings]);

  useEffect(() => {
    if (settingsUpdateStatus === FetchStatus.complete && !settingsUpdateError) {
      onDelete();
    }
  }, [settingsUpdateError, settingsUpdateStatus]);

  return (
    <ExpandableTable
      columns={columns}
      filterBy={filterBy}
      isActionsCell
      isAllExpanded={filterBy ? Object.keys(filterBy).find(key => key === 'child') : false}
      isLoading={isLoading}
      onSort={onSort}
      orderBy={orderBy}
      rows={rows}
    />
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): TagMappingsTableStateProps => {
  const settingsUpdateStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsMappingsChildRemove)
  );
  const settingsUpdateError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateError(state, SettingsType.tagsMappingsChildRemove)
  );

  return {
    settingsUpdateError,
    settingsUpdateStatus,
  };
};

export { TagMappingsTable };
