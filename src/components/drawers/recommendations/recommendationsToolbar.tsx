import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { PerspectiveSelect } from 'routes/views/components/perspective/perspectiveSelect';
import { createMapStateToProps } from 'store/common';

interface RecommendationsToolbarOwnProps {
  isDisabled?: boolean;
  onSelected?: () => void;
  query?: Query;
}

interface RecommendationsToolbarStateProps {
  // TDB...
}

interface RecommendationsToolbarDispatchProps {
  // TDB...
}

interface RecommendationsToolbarState {
  currentItem?: RecommendationsType;
}

type RecommendationsToolbarProps = RecommendationsToolbarOwnProps &
  RecommendationsToolbarStateProps &
  RecommendationsToolbarDispatchProps &
  WrappedComponentProps;

// eslint-disable-next-line no-shadow
const enum RecommendationsType {
  last_24_hrs = 'last_24_hrs',
  last_7_days = 'last_7_days',
  last_15_days = 'last_15_days',
}

export class RecommendationsToolbarBase extends React.Component<RecommendationsToolbarProps> {
  protected defaultState: RecommendationsToolbarState = {
    currentItem: undefined,
  };
  public state: RecommendationsToolbarState = { ...this.defaultState };

  private getOptions = () => {
    return [
      {
        label: messages.recommendationsLast24hrs,
        value: RecommendationsType.last_24_hrs,
      },
      {
        label: messages.recommendationsLast7Days,
        value: RecommendationsType.last_7_days,
      },
      {
        label: messages.recommendationsLast15Days,
        value: RecommendationsType.last_15_days,
      },
    ];
  };

  public render() {
    const { isDisabled, onSelected } = this.props;
    const { currentItem } = this.state;

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
