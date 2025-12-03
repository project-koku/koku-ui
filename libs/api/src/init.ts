import { type RBACFunction, setRBACFunction } from './rbac';

export interface InitAPIProps {
  setRBACFunction: RBACFunction;
}

export const initAPILib = (props: InitAPIProps) => {
  setRBACFunction(props.setRBACFunction);
};
