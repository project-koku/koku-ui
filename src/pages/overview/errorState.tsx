import { Title } from '@patternfly/react-core';
import { BanIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './loadingState.styles';

interface ErrorStateProps {
  isUnauthorized?: boolean;
  subTitle?: string;
  title: string;
}

const ErrorState: React.SFC<ErrorStateProps> = ({
  isUnauthorized,
  subTitle,
  title,
}) => (
  <div className={css(styles.card)}>
    <div className={css(styles.cardBody)}>
      {Boolean(isUnauthorized) ? (
        <BanIcon size="xl" />
      ) : (
        <ErrorCircleOIcon size="xl" />
      )}
      <Title className={css(styles.title)} size="lg">
        {title}
      </Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </div>
  </div>
);

export { ErrorState, ErrorStateProps };
