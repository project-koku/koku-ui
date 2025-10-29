import React from 'react';

interface State {
  isLoading: boolean;
}

function asyncComponent<Props>(
  loader: () => Promise<React.ComponentType<Props> | { default: React.ComponentType<Props> }>
) {
  let LoadedComponent: React.ComponentType<Props> = null;

  class Async extends React.Component<Props, State> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _isMounted = false;

    public state: State = {
      isLoading: !LoadedComponent,
    };

    public componentDidMount() {
      this._isMounted = true;

      if (!this.state.isLoading) {
        return;
      }

      loader().then(Comp => {
        LoadedComponent = (Comp as any).default ? (Comp as any).default : Comp;
        if (this._isMounted) {
          this.setState({ isLoading: false });
        }
      });
    }

    public componentWillUnmount() {
      this._isMounted = false;
    }

    public render() {
      const { isLoading } = this.state;
      return isLoading ? null : <LoadedComponent {...this.props} />;
    }
  }

  return Async;
}

export default asyncComponent;
