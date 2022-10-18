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
  <div>
    <div key="relative">{relativeTime(new Date(date))}</div>
    <small key="formated">{format(date)}</small>
  </div>
);

const NameCol = ({ name, smallText }) => (
  <div>
    <div key="name">{name}</div>
    <small key="small-text">{smallText}</small>
  </div>
);

const RowCell = (t, src: Provider, deleteAction) => {
  const prefix = `${src.name}-${src.type}`;
  const dateCol = (
    <DateCol
      key={`${prefix}-date`}
      name={src.name}
      type={src.type}
      date={src.created_timestamp}
    />
  );
  const nameCol = (
    <NameCol
      name={src.name}
      smallText={src.authentication.provider_resource_name}
    />
  );
  const actionCol = (
    <ActionKebab
      key={`${prefix}-actions`}
      actions={[
        <DropdownItem
          component="button"
          onClick={deleteAction}
          key={`${prefix}-remove-action`}
        >
          {t('source_details.remove_source')}
        </DropdownItem>,
      ]}
    />
  );
  return [
    { title: nameCol },
    {
      title: (
        <div key={`${prefix}-type`}>{t(`source_details.type.${src.type}`)}</div>
      ),
    },
    { title: <div key={`${prefix}-added-by`}>{src.created_by.username}</div> },
    { title: dateCol },
    { title: actionCol },
  ];
};

export default RowCell;
