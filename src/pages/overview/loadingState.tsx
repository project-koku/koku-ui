import { Title } from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './loadingState.styles';

interface LoadingStateProps {
  subTitle?: string;
  title: string;
}

const LoadingState: React.SFC<LoadingStateProps> = ({ subTitle, title }) => (
  <div className={css(styles.card)}>
    <div className={css(styles.cardBody)}>
      <BinocularsIcon size="xl" />
      <Title className={css(styles.title)} size="lg">
        {title}
      </Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </div>
  </div>
);

export { LoadingState, LoadingStateProps };
