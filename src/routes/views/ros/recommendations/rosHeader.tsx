import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

import { styles } from './rosHeader.styles';

interface RosHeaderOwnProps {
  // TBD...
}

interface RosHeaderStateProps {
  // TBD...
}

interface RosHeaderState {}

type RosHeaderProps = RosHeaderOwnProps & RosHeaderStateProps & WrappedComponentProps;

class RosHeaderBase extends React.Component<RosHeaderProps> {
  protected defaultState: RosHeaderState = {};
  public state: RosHeaderState = { ...this.defaultState };

  public render() {
    const { intl } = this.props;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.rosRecommendationsTitle)}
          </Title>
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RosHeaderOwnProps, RosHeaderStateProps>((state, props) => {
  return {
    // TBD...
  };
});

const RosHeader = injectIntl(connect(mapStateToProps, {})(RosHeaderBase));

export { RosHeader };
export type { RosHeaderProps };
