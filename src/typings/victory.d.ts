import * as victory from 'victory';
declare module 'victory' {
  export interface VictoryVoronoiContainerProps
    extends victory.VictoryCommonProps,
      victory.VictoryContainerProps,
      victory.VictoryLabableProps {
    voronoiDimension: 'x' | 'y';
    labels(datum: any): string;
  }
  export const VictoryVoronoiContainer: React.ComponentClass<
    VictoryVoronoiContainerProps
  >;
}
