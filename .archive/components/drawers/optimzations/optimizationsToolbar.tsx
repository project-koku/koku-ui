import type { Query } from 'api/queries/query';
import type { RecommendationItems } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import { connect } from 'react-redux';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';
import { createMapStateToProps } from 'store/common';
import { hasNotification, hasRecommendation } from 'utils/recomendations';

import { Interval } from './optimizationsContent';

interface OptimizationsToolbarOwnProps {
  currentInterval?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  query?: Query;
  recommendations?: RecommendationItems;
}

interface OptimizationsToolbarStateProps {
  // TDB...
}

interface OptimizationsToolbarDispatchProps {
  // TDB...
}

interface OptimizationsToolbarState {}

type OptimizationsToolbarProps = OptimizationsToolbarOwnProps &
  OptimizationsToolbarStateProps &
  OptimizationsToolbarDispatchProps;

export class OptimizationsToolbarBase extends React.Component<OptimizationsToolbarProps, any> {
  protected defaultState: OptimizationsToolbarState = {
    // TBD...
  };
  public state: OptimizationsToolbarState = { ...this.defaultState };

  private getOptions = () => {
    const { recommendations } = this.props;

    return [
      {
        isDisabled: !hasRecommendation(recommendations?.short_term) && !hasNotification(recommendations?.short_term),
        label: messages.optimizationsShortTerm,
        value: Interval.short_term,
      },
      {
        isDisabled: !hasRecommendation(recommendations?.medium_term) && !hasNotification(recommendations?.medium_term),
        label: messages.optimizationsMediumTerm,
        value: Interval.medium_term,
      },
      {
        isDisabled: !hasRecommendation(recommendations?.long_term) && !hasNotification(recommendations?.long_term),
        label: messages.optimizationsLongTerm,
        value: Interval.long_term,
      },
    ];
  };

  public render() {
    const { currentInterval, isDisabled, onSelected } = this.props;

    const options = this.getOptions();

    return (
      <PerspectiveSelect
        currentItem={currentInterval || options[0].value}
        isDisabled={isDisabled}
        onSelected={onSelected}
        options={options}
        title={messages.optimizationsPerspective}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsToolbarOwnProps, OptimizationsToolbarStateProps>(() => {
  return {};
});

const mapDispatchToProps: OptimizationsToolbarDispatchProps = {};

const OptimizationsToolbar = connect(mapStateToProps, mapDispatchToProps)(OptimizationsToolbarBase);

export { OptimizationsToolbar };
