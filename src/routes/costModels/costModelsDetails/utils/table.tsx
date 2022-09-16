import { Bullseye } from '@patternfly/react-core';
import { IAction, ICell, SortByDirection } from '@patternfly/react-table';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { CostModel } from 'api/costModels';
import { intl } from 'components/i18n';
import { format as formatDate } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState/emptyFilterState';
import { LoadingState } from 'routes/components/state/loadingState/loadingState';
import NoCostModels from 'routes/costModels/costModelsDetails/noCostModels';

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
    const dateTime = intl.formatMessage(messages.dateTime, {
      dateTime: formatDate(
        new Date(new Date(item.updated_timestamp).toISOString().replace(/z$/i, '')),
        'dd LLL yyyy kk:mm'
      ),
    });
    return {
      cells: [
        {
          title: <Link to={`/cost-models/${item.uuid}`}>{item.name}</Link>,
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
