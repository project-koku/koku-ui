import {
  Alert,
  AlertVariant,
  Bullseye,
  Button,
  ButtonType,
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AxiosError } from 'axios';
import { BackgroundImage } from 'components/backgroundImage';
import { FormGroup } from 'components/formGroup';
import { TextInput } from 'components/textInput';
import React from 'react';
import { Helmet } from 'react-helmet';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { sessionActions, sessionSelectors } from 'store/session';
import { getTestProps, testIds } from 'testIds';
import { styles } from './login.styles';

export interface Props extends InjectedTranslateProps {
  error?: AxiosError;
  fetchStatus: FetchStatus;
  login: typeof sessionActions.login;
}

interface State {
  username: string;
  password: string;
}

export class Login extends React.Component<Props, State> {
  public state: State = {
    username: '',
    password: '',
  };

  private handleUsernameChange = (username: string) => {
    this.setState(() => ({
      username,
    }));
  };

  private handlePasswordChange = (password: string) => {
    this.setState(() => ({
      password,
    }));
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.login({
      username: this.state.username,
      password: this.state.password,
    });
  };

  public render() {
    const { t, error } = this.props;
    const { username, password } = this.state;
    const passwordError =
      error && error.response && error.response.data.password;
    const usernameError =
      error && error.response && error.response.data.username;
    const nonFieldErrors =
      error && error.response && error.response.data.non_field_errors;
    const defaultError = t('login.default_error');
    let loginError = null;
    if (error && !error.response) {
      loginError = defaultError;
    } else if (nonFieldErrors || usernameError || passwordError) {
      loginError = String(nonFieldErrors || usernameError || passwordError);
    }

    return (
      <>
        <Helmet>
          <body style={styles.body} />
        </Helmet>
        <BackgroundImage />
        <div style={styles.loginPage}>
          <Bullseye>
            <Card style={styles.loginBox}>
              <CardHeader>
                <Title headingLevel="h2" size="xl">
                  {t('login.title')}
                </Title>
              </CardHeader>
              <CardBody>
                <form
                  {...getTestProps(testIds.login.form)}
                  onSubmit={this.handleSubmit}
                >
                  {Boolean(error) && (
                    <div style={styles.alert}>
                      <Alert
                        {...getTestProps(testIds.login.alert)}
                        variant={AlertVariant.danger}
                        title={loginError}
                      />
                    </div>
                  )}
                  <FormGroup label={t('login.username_label')}>
                    <TextInput
                      {...getTestProps(testIds.login.username_input)}
                      autoFocus
                      isError={Boolean(usernameError)}
                      isFlat
                      type="text"
                      onChange={this.handleUsernameChange}
                      value={username}
                    />
                  </FormGroup>
                  <FormGroup label={t('login.password_label')}>
                    <TextInput
                      {...getTestProps(testIds.login.password_input)}
                      isFlat
                      isError={Boolean(passwordError)}
                      type="password"
                      onChange={this.handlePasswordChange}
                      value={password}
                    />
                  </FormGroup>
                  <div>
                    <Button
                      {...getTestProps(testIds.login.submit)}
                      isDisabled={
                        this.props.fetchStatus === FetchStatus.inProgress
                      }
                      type={ButtonType.submit}
                      variant={ButtonVariant.primary}
                    >
                      {t('login.submit')}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Bullseye>
        </div>
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    error: sessionSelectors.selectLoginError(state),
    fetchStatus: sessionSelectors.selectLoginFetchStatus(state),
  })),
  {
    login: sessionActions.login,
  }
)(translate()(Login));
