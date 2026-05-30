import { Button, EmptyState, EmptyStateActions, EmptyStateBody, EmptyStateFooter } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface ReviewSuccessOwnProps {
  name?: string;
  onClose?: () => void;
}

type ReviewSuccessProps = ReviewSuccessOwnProps;

const ReviewSuccess: React.FC<ReviewSuccessProps> = ({ name, onClose }: ReviewSuccessProps) => {
  const intl = useIntl();

  return (
    <EmptyState headingLevel="h2" titleText={intl.formatMessage(messages.costModelsWizardReviewStatusTitle)}>
      <EmptyStateBody>
        {intl.formatMessage(messages.costModelsWizardReviewStatusSubTitle, { value: name })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="link" onClick={onClose}>
            {intl.formatMessage(messages.close)}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { ReviewSuccess };
