import { Grid, GridItem, Title } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  InProgressIcon,
  TimesCircleIcon,
} from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { onboardingActions } from 'store/onboarding';
// import './loader.css';

interface Props extends InjectedTranslateProps {
  type: string;
  name: string;
  clusterId: string;
  apiErrors: AxiosError;
  addSource: typeof onboardingActions.addSource;
  apiStatus: FetchStatus;
}

class Loader extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.props.addSource({
      type: this.props.type,
      name: this.props.name,
      authentication: {
        provider_resource_name: this.props.clusterId,
      },
    });
  }

  public renderIcon() {
    const mH = '7em';
    const style = {
      display: 'block',
      verticalAlign: `${-0.125 * Number.parseFloat(mH)}em`,
      margin: 'auto',
    };
    if (this.props.apiStatus === FetchStatus.inProgress) {
      return (
        <InProgressIcon
          className="in-progress"
          style={style}
          width={mH}
          height={mH}
        />
      );
    }
    if (this.props.apiErrors) {
      const err = this.props.apiErrors;
      let errorMessage: string = null;
      if (err.response && err.response.data && err.response.data.Error) {
        errorMessage = err.response.data.Error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      return (
        <React.Fragment>
          <TimesCircleIcon
            className="popping"
            color="red"
            style={style}
            width={mH}
            height={mH}
          />
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Title size="md">Failed adding source</Title>
            <div>{errorMessage ? errorMessage : 'Something went wrong'}</div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <CheckCircleIcon
          className="popping"
          color="green"
          style={style}
          width={mH}
          height={mH}
        />
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Title size="md">Successfully added this source</Title>
        </div>
      </React.Fragment>
    );
  }

  public render() {
    return (
      <React.Fragment>
        <Title size="xl">{this.props.t('onboarding.final.title')}</Title>
        <br />
        <Grid gutter="md">
          <GridItem span={2} />
          <GridItem span={8}>{this.renderIcon()}</GridItem>
          <GridItem span={2} />

          <GridItem span={2} />
          <GridItem span={8}>
            <div>Source Name: {this.props.name}</div>
            <div>Source Type: {this.props.type}</div>
            <div>Cluster ID: {this.props.clusterId}</div>
          </GridItem>
          <GridItem span={2} />
        </Grid>
      </React.Fragment>
    );
  }
}

export default Loader;
