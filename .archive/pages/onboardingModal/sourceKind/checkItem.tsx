import { Checkbox } from '@patternfly/react-core';
import React from 'react';

interface Props {
  children: React.ReactNode;
  onChange: (value: boolean, event: React.FormEvent<HTMLInputElement>) => void;
  title: string;
  isChecked?: boolean;
  ariaLabel?: string;
  id?: string;
}

const CheckItem: React.SFC<Props> = ({
  children,
  onChange,
  title,
  isChecked = false,
  ariaLabel = null,
  id = null,
}: Props) => (
  <div>
    <Checkbox
      isChecked={isChecked}
      onChange={onChange}
      label={title}
      id={id}
      aria-label={ariaLabel}
    />
    <span style={{ margin: '10px 0 10px 20px' }}>{children}</span>
  </div>
);

export default CheckItem;
