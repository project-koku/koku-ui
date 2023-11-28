import type { Query } from 'api/queries/query';
import type { RecommendationItems } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';
import { hasNotification, hasRecommendation } from 'utils/recomendations';

import { Interval } from './optimizationsBreakdown';

interface OptimizationsBreakdownToolbarOwnProps {
  currentInterval?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  query?: Query;
  recommendations?: RecommendationItems;
}

type OptimizationsBreakdownToolbarProps = OptimizationsBreakdownToolbarOwnProps;

const OptimizationsBreakdownToolbar: React.FC<OptimizationsBreakdownToolbarProps> = ({
  currentInterval,
  isDisabled,
  onSelected,
  recommendations,
}) => {
  const getOptions = () => {
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

  const options = getOptions();

  return (
    <PerspectiveSelect
      currentItem={currentInterval || options[0].value}
      isDisabled={isDisabled}
      onSelected={onSelected}
      options={options}
      title={messages.optimizationsPerspective}
    />
  );
};

export { OptimizationsBreakdownToolbar };
