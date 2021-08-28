import { Bullseye } from '@patternfly/react-core';
import { IAction, ICell, SortByDirection } from '@patternfly/react-table';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { CostModel } from 'api/costModels';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { relativeTime } from 'human-date';
import NoCostModels from 'pages/costModels/costModelsDetails/noCostModels';
import React from 'react';
import { Link } from 'react-router-dom';

import { CostModelsQuery, stringifySearch } from './query';

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
    return {
      cells: [
        {
          title: <Link to={`/cost-models/${item.uuid}`}>{item.name}</Link>,
        },
        item.description,
        item.source_type,
        item.sources.length.toString(),
        relativeTime(item.updated_timestamp),
      ],
      data: { costModel: item },
    };
  });
}

export function createOnSort(cells: ICell[], query: CostModelsQuery, push: (path: string) => void) {
  return function (_event, index: number, direction: SortByDirection) {
    const name = cells[index] && cells[index].data ? cells[index].data.orderName : null;
    if (name === null) {
      return;
    }
    if (direction === SortByDirection.asc) {
      push(stringifySearch({ ...query, ordering: name }));
      return;
    }
    push(stringifySearch({ ...query, ordering: `-${name}` }));
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
