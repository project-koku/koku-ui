import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

import { styles } from './recommendations.styles';

interface RecommendationsHeaderOwnProps {
  // TBD...
}

interface RecommendationsHeaderStateProps {
  // TBD...
}

interface RecommendationsHeaderState {}

type RecommendationsHeaderProps = RecommendationsHeaderOwnProps &
  RecommendationsHeaderStateProps &
  WrappedComponentProps;

class RecommendationsHeaderBase extends React.Component<RecommendationsHeaderProps, RecommendationsHeaderState> {
  protected defaultState: RecommendationsHeaderState = {};
  public state: RecommendationsHeaderState = { ...this.defaultState };

  public render() {
    const { intl } = this.props;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.recommendations)}
          </Title>
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RecommendationsHeaderOwnProps, RecommendationsHeaderStateProps>(() => {
  return {
    // TBD...
  };
});

const RecommendationsHeader = injectIntl(connect(mapStateToProps, {})(RecommendationsHeaderBase));

export { RecommendationsHeader };
export type { RecommendationsHeaderProps };
