import React from 'react';

import { Form, Grid, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

import apiTypes from '../../store/constants/apiConstants';
import helpers from '../../utils/helpers';

import { connect } from 'react-redux';
import reduxActions from '../../store/actions';

import CopyField from '../copyField/copyField';
import Tooltip from '../tooltip/tooltip';

export interface Props {
  getSystemConfig: PropTypes.func;
  awsAccountId: PropTypes.string;
}

class AccountWizardStepRole extends React.Component<Props> {
  public componentDidMount() {
    const { getSystemConfig } = this.props;

    getSystemConfig();
  }

  // ToDo: when form valid evaluate moving to next step onEnter key-press event
  public onSubmit = event => {
    event.preventDefault();
  };

  public render() {
    const { awsAccountId } = this.props;

    const popover = (
      <ul className="cloudmeter-popover-list">
        <li>Log in to AWS console</li>
        <li>Search Services to go to IAM</li>
        <li>Click Roles in the left nav</li>
        <li>
          Click the <strong>Create role</strong> button
        </li>
        <li>
          Click <strong>Another AWS account</strong>
        </li>
      </ul>
    );

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.FormGroup>
          <Grid.Col sm={12}>
            <ul>
              <li>
                Create a new role in the AWS
                <a
                  href="https://console.aws.amazon.com/iam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Identity and Access Management
                </a>
                .
                <Tooltip delayShow={100} popover={popover}>
                  <Icon type="pf" name="info" size="large" />
                  <span className="sr-only">
                    Steps when logging into AWS Identity and Access Management
                  </span>
                </Tooltip>
              </li>
              <li>
                <p>
                  Paste this value into the Account ID field under{' '}
                  <strong>Another AWS account</strong>:
                </p>
                <CopyField id="account-id" value={awsAccountId || ''} />
              </li>
              <li>
                In the next step, select <strong>Cloud-Meter-policy</strong>.
              </li>
              <li>
                Continue, name the role <strong>Cloud-Meter-role</strong>, and
                click <strong>Create role</strong>.
              </li>
            </ul>
          </Grid.Col>
        </Form.FormGroup>
      </Form>
    );
  }
}

(AccountWizardStepRole as any).propTypes = {
  getSystemConfig: PropTypes.func,
  awsAccountId: PropTypes.string,
};

(AccountWizardStepRole as any).defaultProps = {
  getSystemConfig: helpers.noop,
  awsAccountId: null,
};

const mapDispatchToProps = dispatch => ({
  getSystemConfig: () => dispatch(reduxActions.systemConfig.getSystemConfig()),
});

const mapStateToProps = state => ({
  awsAccountId:
    state.accountWizard.configuration[apiTypes.API_SUBMIT_ACCOUNT_AWS_ID],
});

const ConnectedAccountWizardStepRole = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountWizardStepRole);

export {
  ConnectedAccountWizardStepRole as default,
  ConnectedAccountWizardStepRole,
  AccountWizardStepRole,
};
