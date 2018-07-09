import {
  Bullseye,
  Button,
  ButtonType,
  ButtonVariant,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Box, BoxBody, BoxHeader } from 'components/box';
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
    const { t } = this.props;
    const { username, password } = this.state;
    return (
      <>
        <Helmet>
          <body className={css(styles.body)} />
        </Helmet>
        <div className={css(styles.loginPage)}>
          <Bullseye>
            <Box className={css(styles.loginBox)}>
              <BoxHeader>
                <Title size={TitleSize['2xl']}>{t('login.title')}</Title>
              </BoxHeader>
              <BoxBody>
                <form
                  {...getTestProps(testIds.login.form)}
                  onSubmit={this.handleSubmit}
                >
                  <FormGroup label={t('login.username_label')}>
                    <TextInput
                      {...getTestProps(testIds.login.username_input)}
                      autoFocus
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
                      type="password"
                      onChange={this.handlePasswordChange}
                      value={password}
                    />
                  </FormGroup>
                  <div>
                    <Button
                      {...getTestProps(testIds.login.submit)}
                      type={ButtonType.submit}
                      variant={ButtonVariant.primary}
                    >
                      {t('login.submit')}
                    </Button>
                  </div>
                </form>
              </BoxBody>
            </Box>
          </Bullseye>
        </div>
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    fetchStatus: sessionSelectors.selectLoginFetchStatus(state),
  })),
  {
    login: sessionActions.login,
  }
)(translate()(Login));
