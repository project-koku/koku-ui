import React from 'react';

interface State {
  isLoading: boolean;
}

export function asyncComponent<Props = {}>(
  loader: () => Promise<
    React.ComponentType<Props> | { default: React.ComponentType<Props> }
  >
) {
  let LoadedComponent: React.ComponentType<Props> = null;

  class Async extends React.Component<Props, State> {
    public state: State = {
      isLoading: !LoadedComponent,
    };

    public componentDidMount() {
      if (!this.state.isLoading) {
        return;
      }

      loader().then(Comp => {
        LoadedComponent = (Comp as any).default ? (Comp as any).default : Comp;
        this.setState({ isLoading: false });
      });
    }

    public render() {
      const { isLoading } = this.state;
      return isLoading ? null : <LoadedComponent {...this.props} />;
    }
  }

  return Async;
}
