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
    static Masthead: typeof VerticalNavMasthead;
  }
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
