import { Title } from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './loadingState.styles';

interface LoadingStateProps extends InjectedTranslateProps {
  isBinocularsIcon?: boolean;
}

const LoadingStateBase: React.SFC<LoadingStateProps> = ({
  isBinocularsIcon,
  t,
}) => {
  const title = t('loading_state.sources_title');
  const subTitle = t('loading_state.sources_desc');

  return (
    <div className={css(styles.card)}>
      <div className={css(styles.cardBody)}>
        {Boolean(isBinocularsIcon !== false) && <BinocularsIcon size="xl" />}
        <Title className={css(styles.title)} size="lg">
          {title}
        </Title>
        {Boolean(subTitle) && (
          <p className={css(styles.subtitle)}>{subTitle}</p>
        )}
      </div>
    </div>
  );
};

const LoadingState = translate()(LoadingStateBase);

export { LoadingState };
