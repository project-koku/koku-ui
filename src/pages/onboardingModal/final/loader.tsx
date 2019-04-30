import { Alert, Title, TitleSize } from '@patternfly/react-core';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { FetchStatus } from 'store/common';
import Item from './item';

interface Props extends InjectedTranslateProps {
  type: string;
  name: string;
  clusterId: string;
  arn: string;
  apiErrors: AxiosError;
  apiStatus: FetchStatus;
}

class Loader extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  private parseError() {
    const { apiStatus: status, apiErrors: error } = this.props;
    if (status === FetchStatus.inProgress) {
      return null;
    }

    if (error === null) {
      return null;
    }

    let errorMessage: string = 'Something went wrong';
    if (error.response && error.response.data) {
      errorMessage = error.response.data.Error;
      if (!errorMessage && error.response.data.errors !== undefined) {
        errorMessage = error.response.data.errors
          .map(er => er.detail)
          .join(', ');
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return errorMessage;
  }

  public render() {
    const { t, name, type, clusterId, arn } = this.props;
    const errors = this.parseError();
    return (
      <React.Fragment>
        {errors !== null && (
          <div style={{ paddingBottom: '30px' }}>
            <Alert
              variant="danger"
              title={`${errors}. Please click "Back" to revise.`}
            />
          </div>
        )}
        <Title size={TitleSize.xl}>{t('onboarding.final.title')}</Title>
        <p>{t('onboarding.final.desc')}</p>
        <br />
        <Item value={name} title={t('onboarding.final.name')} />
        <Item
          value={t(`onboarding.final.type.${type}`)}
          title={t('onboarding.final.type.title')}
        />
        {type === 'AWS' && (
          <Item value={arn} title={t('onboarding.final.arn')} />
        )}
        {type === 'OCP' && (
          <Item value={clusterId} title={t('onboarding.final.cluster')} />
        )}
      </React.Fragment>
    );
  }
}

export default Loader;
