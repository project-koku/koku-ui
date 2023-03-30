import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

import { styles } from './optimizations.styles';

interface OptimizationsHeaderOwnProps {
  // TBD...
}

interface OptimizationsHeaderStateProps {
  // TBD...
}

interface OptimizationsHeaderState {}

type OptimizationsHeaderProps = OptimizationsHeaderOwnProps & OptimizationsHeaderStateProps & WrappedComponentProps;

class OptimizationsHeaderBase extends React.Component<OptimizationsHeaderProps, OptimizationsHeaderState> {
  protected defaultState: OptimizationsHeaderState = {};
  public state: OptimizationsHeaderState = { ...this.defaultState };

  public render() {
    const { intl } = this.props;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.optimizations)}
          </Title>
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsHeaderOwnProps, OptimizationsHeaderStateProps>(() => {
  return {
    // TBD...
  };
});

const OptimizationsHeader = injectIntl(connect(mapStateToProps, {})(OptimizationsHeaderBase));

export { OptimizationsHeader };
export type { OptimizationsHeaderProps };
