import { DropdownItem } from '@patternfly/react-core';
import { Provider } from 'api/providers';
import ActionKebab from 'components/actionKebab';
import { relativeTime } from 'human-date';
import React from 'react';

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

const rowCell = (t, src: Provider, deleteAction) => {
  const prefix = `${src.name}-${src.type}`;
  const dateCol = (
    <DateCol
      key={`${prefix}-date`}
      name={src.name}
      type={src.type}
      date={src.customer.date_created}
    />
  );
  const deleteItem = (
    <DropdownItem
      component="button"
      onClick={deleteAction}
      key={`${prefix}-remove-action`}
    >
      {t('source_details.remove_source')}
    </DropdownItem>
  );
  return [
    <div key={`${prefix}-name`}>{src.name}</div>,
    <div key={`${prefix}-type`}>{src.type}</div>,
    dateCol,
    <ActionKebab key={`${prefix}-actions`} actions={[deleteItem]} />,
  ];
};

export default rowCell;
