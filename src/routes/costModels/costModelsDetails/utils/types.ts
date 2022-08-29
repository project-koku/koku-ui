import { RouteComponentProps } from 'react-router-dom';

export interface Inputer {
  value: string;
  setValue: (value: string) => void;
}

export type HistoryPush = RouteComponentProps['history']['push'];

export interface Opener {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}
