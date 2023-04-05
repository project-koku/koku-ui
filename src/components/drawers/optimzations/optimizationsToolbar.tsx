import type { Query } from 'api/queries/query';
import type { RecommendationItems } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import { connect } from 'react-redux';
import { PerspectiveSelect } from 'routes/views/components/perspective/perspectiveSelect';
import { createMapStateToProps } from 'store/common';

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
        isDisabled: !(recommendations && recommendations.short_term && !recommendations.short_term.notifications),
        label: messages.recommendationsShortTerm,
        value: Interval.short_term,
      },
      {
        isDisabled: !(recommendations && recommendations.medium_term && !recommendations.medium_term.notifications),
        label: messages.recommendationsMediumTerm,
        value: Interval.medium_term,
      },
      {
        isDisabled: !(recommendations && recommendations.long_term && !recommendations.long_term.notifications),
        label: messages.recommendationsLongTerm,
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
        title={messages.recommendationsPerspective}
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
