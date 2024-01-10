import React from 'react';
import { interpret } from 'xstate';

export interface WithStateMachineState {
  current: any;
}

export interface WithStateMachinePropsRender {
  current: any;
  send: (event: any) => void;
}

export interface WithStateMachineProps {
  machine: any;
  children: (args: WithStateMachinePropsRender) => JSX.Element;
}

export class WithStateMachine extends React.Component<WithStateMachineProps, WithStateMachineState> {
  public service = null;
  constructor(props) {
    super(props);
    this.service = interpret(props.machine).onTransition(current => this.setState({ current }));
    this.state = {
      current: props.machine.initialState,
    };
  }

  public componentDidMount() {
    this.service.start();
  }

  public componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    const { current } = this.state;
    const { send } = this.service;
    return this.props.children({ current, send });
  }
}
