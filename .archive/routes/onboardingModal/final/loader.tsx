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
  azureCreds: { [k: string]: { value: string } };
  azureAuth: { [k: string]: { value: string } };
  apiErrors: AxiosError;
  apiStatus: FetchStatus;
}

class Loader extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  private parseError() {
    const { t, apiStatus: status, apiErrors: error } = this.props;
    if (status === FetchStatus.inProgress) {
      return null;
    }

    if (error === null) {
      return null;
    }

    let errorMessage: string = t('onboarding.final.default_error');
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
    const { t, name, type, clusterId, arn, azureAuth, azureCreds } = this.props;
    const errors = this.parseError();
    return (
      <React.Fragment>
        {errors !== null && (
          <div style={{ paddingBottom: '30px' }}>
            <Alert
              variant="danger"
              title={`${errors}. ${t('onboarding.final.please_revise')}`}
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
        {type === 'AZURE' &&
          Object.keys(azureCreds).map(field => (
            <Item
              value={azureCreds[field].value}
              title={t(`onboarding.final.${field}`)}
            />
          ))}
        {type === 'AZURE' &&
          Object.keys(azureAuth).map(field => (
            <Item
              value={azureAuth[field].value}
              title={t(`onboarding.final.${field}`)}
            />
          ))}
      </React.Fragment>
    );
  }
}

export default Loader;
