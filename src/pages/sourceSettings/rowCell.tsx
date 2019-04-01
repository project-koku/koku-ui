import { Provider } from 'api/providers';
import { relativeTime } from 'human-date';
import React from 'react';
import SourceActions from './itemActions';

const format = dateString => {
  const d = new Date(dateString);
  const r = d.toUTCString().split(' ');
  const month = r[2];
  const year = r[3];
  const dayOfMonth = r[1];

  return `${dayOfMonth} ${month} ${year} ${d.getHours()}:${d.getMinutes()}`;
};

const DateCol = ({ name, type, date }) => (
  <div key={`${name}-${type}-date-created`}>
    <div key="relative">{relativeTime(new Date(date))}</div>
    <small key="formated">{format(date)}</small>
  </div>
);

const ActionCol = ({ t, name, type, uuid, deleteAction }) => (
  <div key="actions">
    <SourceActions
      t={t}
      onDelete={() => {
        deleteAction({
          name,
          type,
          onDelete: () => {
            deleteAction(uuid);
          },
        });
      }}
    />
  </div>
);

const rowCell = (t, src: Provider, deleteAction) => {
  const dateCol = (
    <DateCol
      key={`${src.name}-${src.type}-date`}
      name={src.name}
      type={src.type}
      date={src.customer.date_created}
    />
  );
  const actionCol = (
    <ActionCol
      key={`${src.name}-${src.type}-actions`}
      t={t}
      name={src.name}
      type={src.type}
      uuid={src.uuid}
      deleteAction={deleteAction}
    />
  );
  return [
    <div key={`${src.name}-${src.type}-name`}>{src.name}</div>,
    <div key={`${src.name}-${src.type}-type`}>{src.type}</div>,
    dateCol,
    actionCol,
  ];
};

export default rowCell;
