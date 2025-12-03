import React from 'react';

interface State {
  isLoading: boolean;
}

function asyncComponent<Props>(
  loader: () => Promise<React.ComponentType<Props> | { default: React.ComponentType<Props> }>
) {
  let LoadedComponent: React.ComponentType<Props> = null;

  class Async extends React.Component<Props, State> {
    #isMounted = false;

    public state: State = {
      isLoading: !LoadedComponent,
    };

    public componentDidMount() {
      this.#isMounted = true;

      if (!this.state.isLoading) {
        return;
      }

      loader().then(Comp => {
        LoadedComponent = (Comp as any).default ? (Comp as any).default : Comp;
        if (this.#isMounted) {
          this.setState({ isLoading: false });
        }
      });
    }

    public componentWillUnmount() {
      this.#isMounted = false;
    }

    public render() {
      const { isLoading } = this.state;
      return isLoading ? null : <LoadedComponent {...this.props} />;
    }
  }

  return Async;
}

export default asyncComponent;
