import { Select, SelectOption, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { noop } from '../../utils/noop';
import { styles } from './header.styles';

interface GroupByOption {
  value: string;
  label: string;
}

interface GroupByProps {
  title: string;
  label: string;
  onChange: (value) => void;
  options?: GroupByOption[];
  initValue?: string;
}

export const GroupBySelector: React.SFC<GroupByProps> = ({
  title,
  label,
  onChange,
  options,
  initValue,
}) => (
  <React.Fragment>
    <Title size="2xl">{title}</Title>
    <div className={css(styles.groupBySelector)}>
      <label className={css(styles.groupBySelectorLabel)}>{label}</label>
    </div>
    <Select
      onBlur={noop}
      onFocus={noop}
      value={initValue}
      aria-label="group by selector"
      onChange={onChange}
    >
      {options.map(option => (
        <SelectOption
          key={`group-by-${option.value}`}
          value={option.value}
          label={option.label}
        />
      ))}
    </Select>
  </React.Fragment>
);

GroupBySelector.defaultProps = {
  options: [],
  initValue: '',
};
