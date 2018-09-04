import { HTMLProps, ReactNode } from 'react';

declare module '@patternfly/react-core' {
  export interface ModalProps extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
    className?: string;
    isOpen?: boolean;
    title: string;
    hideTitle?: boolean;
    actions?: any[];
    onClose?: () => void;
    isLarge?: boolean;
  }
  export const Modal: React.ComponentClass<ModalProps>;
}
