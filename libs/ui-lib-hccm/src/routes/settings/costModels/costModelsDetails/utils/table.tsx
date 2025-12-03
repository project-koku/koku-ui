import type { CostModel } from '@koku-ui/api/costModels';
import { intl } from '@koku-ui/i18n/i18n';
import { Bullseye } from '@patternfly/react-core';
import type { IAction, ICell } from '@patternfly/react-table';
import { SortByDirection } from '@patternfly/react-table';
import React from 'react';
import { Link } from 'react-router-dom';

import { Unavailable } from '../../../../../init';
import { routes } from '../../../../../routes';
import { formatPath } from '../../../../../utils/paths';
import type { RouteComponentProps } from '../../../../../utils/router';
import { EmptyFilterState } from '../../../../components/state/emptyFilterState';
import { LoadingState } from '../../../../components/state/loadingState';
import NoCostModels from '../noCostModels';
import type { CostModelsQuery } from './query';
import { stringifySearch } from './query';

export function getRowsByStateName(stateName: string, data: any) {
  let component = null;
  if (stateName === 'loading') {
    component = <LoadingState />;
  }
  if (stateName === 'empty') {
    component = <NoCostModels />;
  }
  if (stateName === 'no-match') {
    component = <EmptyFilterState />;
  }
  if (stateName === 'failure') {
    component = <Unavailable />;
  }

  if (component !== null) {
    return [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 6 },
            title: <Bullseye> {component} </Bullseye>,
          },
        ],
      },
    ];
  }
  return data.map((item: CostModel) => {
    const dateTime: any = intl.formatDate(item.updated_timestamp, {
      day: 'numeric',
      hour: 'numeric',
      hour12: false,
      minute: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      timeZoneName: 'short',
      year: 'numeric',
    });
    return {
      cells: [
        {
          title: <Link to={`${formatPath(routes.costModel.basePath)}/${item.uuid}`}>{item.name}</Link>,
        },
        item.description,
        item.source_type,
        item.sources.length.toString(),
        dateTime,
      ],
      data: { costModel: item },
    };
  });
}

export function createOnSort(cells: ICell[], query: CostModelsQuery, router: RouteComponentProps) {
  return function (_evt, index: number, direction: SortByDirection) {
    const name = cells[index] && cells[index].data ? cells[index].data.orderName : null;
    if (name === null) {
      return;
    }
    if (direction === SortByDirection.asc) {
      router.navigate(stringifySearch({ ...query, ordering: name }));
      return;
    }
    router.navigate(stringifySearch({ ...query, ordering: `-${name}` }));
  };
}

export function createActions(stateName: string, canWrite: boolean, actions: IAction[]): IAction[] {
  if (stateName !== 'success') {
    return [];
  }

  return actions.map(action => {
    return {
      ...action,
      isDisabled: !canWrite,
      style: !canWrite ? { pointerEvents: 'auto' } : undefined,
      ...(!canWrite && {
        tooltipProps: {
          content: action.tooltipProps?.content,
        },
      }),
    };
  });
}
