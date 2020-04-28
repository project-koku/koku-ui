import * as React from 'react';
import * as victory from 'victory';

declare module 'victory' {
  export interface VictoryLegendProps extends victory.VictoryLegendProps {
    events?: victory.EventPropTypeInterface<
      string,
      victory.StringOrNumberOrCallback
    >[];
    title?: string | any[];
  }

  export interface VictoryVoronoiContainerProps
    extends victory.VictoryCommonProps,
      victory.VictoryContainerProps,
      victory.VictoryLabableProps {
    voronoiDimension: 'x' | 'y';
    labels(datum: any): string;
  }

  export const VictoryLegend: React.ComponentClass<VictoryLegendProps>;

  export const VictoryVoronoiContainer: React.ComponentClass<VictoryVoronoiContainerProps>;

  export const Point: React.ComponentClass;
}
