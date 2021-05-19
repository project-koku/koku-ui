import React from 'react';

import { ChartDatum, getDateRangeString } from './chartDatumUtils';
import { styles } from './chartLegendItem.styles';

interface ChartLegendItemProps {
  data: ChartDatum[];
  idKey?: string;
  isCurrent?: boolean;
  index?: number;
  style?: any;
}

const ChartLegendItem: React.SFC<ChartLegendItemProps> = ({ data, isCurrent, idKey = 'date', index, style }) => {
  if (!data || data.length === 0) {
    return <div />;
  }
  const styling = Boolean(style) && Boolean(style.legendItem) ? style.legendItem : styles.legendItem;
  if (idKey === 'date') {
    const label = getDateRangeString(data);
    return (
      <div style={styling}>
        <div
          style={{
            ...styles.color,
            ...(isCurrent ? styles.currentColor : styles.previousColor),
          }}
        />
        {label}
      </div>
    );
  } else {
    return (
      <div key={data[index].key} style={styling}>
        <div
          style={{
            ...styles.color,
            ...(isCurrent ? styles.currentColor : styles.previousColor),
          }}
        />
        {data[index].key}
      </div>
    );
  }
};

export { ChartLegendItem, ChartLegendItemProps };
