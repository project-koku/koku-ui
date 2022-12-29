import { Bullseye } from '@patternfly/react-core';
import type { IAction, ICell } from '@patternfly/react-table';
import { SortByDirection } from '@patternfly/react-table';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import type { CostModel } from 'api/costModels';
import { intl } from 'components/i18n';
import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { LoadingState } from 'routes/components/state/loadingState';
import NoCostModels from 'routes/costModels/costModelsDetails/noCostModels';
import type { RouteComponentProps } from 'utils/router';

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
            props: { colSpan: 5 },
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
          title: <Link to={`/cost-models/${item.uuid}`}>{item.name}</Link>,
        },
        item.description,
        item.source_type,
        item.sources.length.toString(),
        dateTime._isMockFunction ? '' : dateTime, // Mock may return an object here
      ],
      data: { costModel: item },
    };
  });
}

export function createOnSort(cells: ICell[], query: CostModelsQuery, router: RouteComponentProps) {
  return function (_event, index: number, direction: SortByDirection) {
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
      tooltip: !canWrite ? action.tooltip : undefined,
    };
  });
}
