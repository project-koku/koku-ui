import { Title } from '@patternfly/react-core';
import { BanIcon, ErrorCircleOIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './errorState.styles';

interface ErrorStateProps extends InjectedTranslateProps {
  error: AxiosError;
}

const ErrorStateBase: React.SFC<ErrorStateProps> = ({ error, t }) => {
  let isUnauthorized = false;
  let title = t('error_state.unexpected_title');
  let subTitle = t('error_state.unexpected_desc');

  if (error && error.response && error.response.status === 401) {
    isUnauthorized = true;
    title = t('error_state.unauthorized_title');
    subTitle = t('error_state.unauthorized_desc');
  }

  return (
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
        {Boolean(subTitle) && (
          <p className={css(styles.subtitle)}>{subTitle}</p>
        )}
      </div>
    </div>
  );
};

const ErrorState = translate()(ErrorStateBase);

export { ErrorState };
