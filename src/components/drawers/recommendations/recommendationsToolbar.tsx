import type { Query } from 'api/queries/query';
import type { RecommendationItems } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { PerspectiveSelect } from 'routes/views/components/perspective/perspectiveSelect';
import { createMapStateToProps } from 'store/common';

import { RecommendationTerm } from './recommendationsContent';

interface RecommendationsToolbarOwnProps {
  currentItem?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  query?: Query;
  recommendations?: RecommendationItems;
}

interface RecommendationsToolbarStateProps {
  // TDB...
}

interface RecommendationsToolbarDispatchProps {
  // TDB...
}

interface RecommendationsToolbarState {}

type RecommendationsToolbarProps = RecommendationsToolbarOwnProps &
  RecommendationsToolbarStateProps &
  RecommendationsToolbarDispatchProps &
  WrappedComponentProps;

export class RecommendationsToolbarBase extends React.Component<RecommendationsToolbarProps, any> {
  protected defaultState: RecommendationsToolbarState = {
    // TBD...
  };
  public state: RecommendationsToolbarState = { ...this.defaultState };

  private getOptions = () => {
    const { recommendations } = this.props;

    return [
      {
        isDisabled: !(recommendations && recommendations.short_term),
        label: messages.recommendationsShortTerm,
        value: RecommendationTerm.short_term,
      },
      {
        isDisabled: !(recommendations && recommendations.medium_term),
        label: messages.recommendationsMediumTerm,
        value: RecommendationTerm.medium_term,
      },
      {
        isDisabled: !(recommendations && recommendations.long_term),
        label: messages.recommendationsLongTerm,
        value: RecommendationTerm.long_term,
      },
    ];
  };

  public render() {
    const { currentItem, isDisabled, onSelected } = this.props;

    const options = this.getOptions();

    return (
      <PerspectiveSelect
        currentItem={currentItem || options[0].value}
        isDisabled={isDisabled}
        onSelected={onSelected}
        options={options}
        title={messages.recommendationsPerspective}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RecommendationsToolbarOwnProps, RecommendationsToolbarStateProps>(() => {
  return {};
});

const mapDispatchToProps: RecommendationsToolbarDispatchProps = {};

const RecommendationsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(RecommendationsToolbarBase);
const RecommendationsToolbar = injectIntl(RecommendationsToolbarConnect);

export { RecommendationsToolbar };
export type { RecommendationsToolbarProps };
