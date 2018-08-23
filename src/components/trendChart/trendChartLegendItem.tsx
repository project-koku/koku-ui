import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './trendChartLegendItem.styles';
import { getDateRangeString, TrendChartDatum } from './trendChartUtils';

interface TrendChartLegendItemProps {
  data: TrendChartDatum[];
  isCurrent?: boolean;
}

const TrendChartLegendItem: React.SFC<TrendChartLegendItemProps> = ({
  data,
  isCurrent,
}) => {
  if (!data || data.length === 0) {
    return <div />;
  }
  const range = getDateRangeString(data);
  return (
    <div className={css(styles.trendlegendItem)}>
      <div
        className={css(
          styles.color,
          isCurrent ? styles.currentColor : styles.previousColor
        )}
      />
      {range}
    </div>
  );
};

export { TrendChartLegendItem, TrendChartLegendItemProps };
