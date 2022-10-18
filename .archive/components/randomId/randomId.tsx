import React from 'react';

let currentId = 0;

interface Props {
  prefix?: string;
  children?(props: { id: string }): React.ReactNode;
}

class RandomId extends React.Component<Props> {
  public static defaultProps = {
    prefix: 'random-id-',
  };
  private id = `${this.props.prefix}${currentId++}`;

  public render() {
    return this.props.children({ id: this.id });
  }
}

export { Props, RandomId };
