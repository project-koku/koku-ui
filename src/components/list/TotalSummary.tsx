import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './header.styles';

interface TotalSummaryProps {
  value: string | number;
  totalLabel: string;
  dateLabel: string;
}

export const TotalSummary: React.SFC<TotalSummaryProps> = ({
  value,
  totalLabel,
  dateLabel,
}) => (
  <div className={css(styles.total)}>
    <Title className={css(styles.totalValue)} size="4xl">
      {value}
    </Title>
    <div className={css(styles.totalLabel)}>
      <div className={css(styles.totalLabelUnit)}>{totalLabel}</div>
      <div className={css(styles.totalLabelDate)}>{dateLabel}</div>
    </div>
  </div>
);
