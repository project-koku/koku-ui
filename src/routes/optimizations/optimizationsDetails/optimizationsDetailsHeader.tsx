import { Button, ButtonVariant, Popover, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

import { styles } from './optimizationsDetailsHeader.styles';

interface OptimizationsDetailsHeaderOwnProps {
  // TBD...
}

interface OptimizationsDetailsHeaderStateProps {
  // TBD...
}

interface OptimizationsDetailsHeaderState {}

type OptimizationsDetailsHeaderProps = OptimizationsDetailsHeaderOwnProps &
  OptimizationsDetailsHeaderStateProps &
  WrappedComponentProps;

class OptimizationsDetailsHeaderBase extends React.Component<
  OptimizationsDetailsHeaderProps,
  OptimizationsDetailsHeaderState
> {
  protected defaultState: OptimizationsDetailsHeaderState = {};
  public state: OptimizationsDetailsHeaderState = { ...this.defaultState };

  public render() {
    const { intl } = this.props;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.optimizations)}
            <span style={styles.infoIcon}>
              <Popover
                aria-label={intl.formatMessage(messages.optimizationsInfoArialLabel)}
                enableFlip
                bodyContent={<p style={styles.infoTitle}>{intl.formatMessage(messages.optimizationsInfo)}</p>}
              >
                <Button
                  aria-label={intl.formatMessage(messages.optimizationsInfoButtonArialLabel)}
                  variant={ButtonVariant.plain}
                >
                  <OutlinedQuestionCircleIcon />
                </Button>
              </Popover>
            </span>
          </Title>
        </div>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsDetailsHeaderOwnProps, OptimizationsDetailsHeaderStateProps>(
  () => {
    return {
      // TBD...
    };
  }
);

const OptimizationsDetailsHeader = injectIntl(connect(mapStateToProps, {})(OptimizationsDetailsHeaderBase));

export { OptimizationsDetailsHeader };
export type { OptimizationsDetailsHeaderProps };
