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

interface Props extends InjectedTranslateProps {
  status: string;
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
      return <InProgressIcon style={style} width={mH} height={mH} />;
    }
    if (this.props.apiErrors) {
      return (
        <TimesCircleIcon color="red" style={style} width={mH} height={mH} />
      );
    }
    return (
      <CheckCircleIcon color="green" style={style} width={mH} height={mH} />
    );
  }

  public render() {
    return (
      <React.Fragment>
        <Title size="xl">{this.props.t('onboarding.final.title')}</Title>
        <br />
        <Grid gutter="lg">
          <GridItem span={2} />
          <GridItem span={8}>{this.renderIcon()}</GridItem>
          <GridItem span={2} />
        </Grid>
      </React.Fragment>
    );
  }
}

export default Loader;
