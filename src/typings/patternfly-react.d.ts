declare module 'patternfly-react' {
  import React from 'react';

  export { Navbar, NavbarProps, Nav, NavProps } from 'react-bootstrap';

  export type AlertType = 'error' | 'warning' | 'success' | 'info';
  export interface AlertProps {
    className?: string;
    onDismiss?(event: React.MouseEvent<HTMLButtonElement>): void;
    type?: AlertType;
    children?: React.ReactNode;
  }
  export const Alert: React.SFC<AlertProps>;

  export const VerticalNavMasthead: React.ComponentClass<any>;
  export class VerticalNav extends React.Component<any> {
    public static Masthead: typeof VerticalNavMasthead;
  }

  type Column = (string | number)[];

  export interface ChartData<T = object> {
    columns?: (string | number)[][];
    json?: [T];
    keys?: {
      x?: string;
      value: [keyof T];
    };
  }

  export interface ChartProps {
    data: ChartData;
  }

  export const LineChart: React.SFC<ChartProps>;
  export const BarChart: React.SFC<ChartProps>;
}

declare module 'patternfly-react/dist/js/components/Alert' {
  export { Alert, AlertProps, AlertType } from 'patternfly-react';
}

declare module 'patternfly-react/dist/js/components/Navbar' {
  export { Navbar, NavbarProps } from 'patternfly-react';
}

declare module 'patternfly-react/dist/js/components/Nav' {
  export { Nav, NavProps } from 'patternfly-react';
}

declare module 'patternfly-react/dist/js/components/Chart' {
  export { BarChart, LineChart } from 'patternfly-react';
}
