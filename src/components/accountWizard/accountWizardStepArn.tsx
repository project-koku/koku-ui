import React from 'react';

import { Form, Grid, Icon } from 'patternfly-react';
import PropTypes from 'prop-types';

import store from '../../index';
import apiTypes from '../../store/constants/apiConstants';

import { connect } from 'react-redux';
import reduxTypes from '../../store/constants';

import { FormField } from '../formField/formField';
import Tooltip from '../tooltip/tooltip';

export interface Props {
  stepArnValid: PropTypes.bool;
  stepArnErrorMessage: PropTypes.string;
}

class AccountWizardStepArn extends React.Component<Props> {
  public state = {
    accountArn: '',
    accountArnError: null,
  };

  public onChangeAccountArn = event => {
    const { value } = event.target;
    const errorMessage = !new RegExp('^arn:aws:').test(value)
      ? 'You must enter a valid ARN'
      : '';

    this.setState(
      {
        accountArn: value,
        accountArnError: errorMessage,
      },
      () => this.isStepValid()
    );
  };

  // ToDo: when form valid evaluate moving to next step onEnter key-press event
  public onSubmit = event => {
    event.preventDefault();
  };

  public isStepValid() {
    const { accountArn, accountArnError } = this.state;
    const stepValid = accountArnError === '';
    const dispatchType = stepValid
      ? reduxTypes.account.ADD_ACCOUNT_WIZARD_STEP_ARN
      : reduxTypes.account.INVALID_ACCOUNT_WIZARD_STEP_ARN;

    store.dispatch({
      type: dispatchType,
      account: {
        [apiTypes.API_SUBMIT_ACCOUNT_ARN]: accountArn,
      },
    });
  }

  public render() {
    const { stepArnValid, stepArnErrorMessage } = this.props;
    const { accountArn, accountArnError } = this.state;

    let stepError = null;

    if (!stepArnValid) {
      stepError = stepArnErrorMessage;
    }

    const popover = (
      <ul className="cloudmeter-popover-list">
        <li>
          In <strong>IAM</strong> go to the <strong>Roles</strong> tab
        </li>
        <li>
          Click <strong>Cloud-Meter-role</strong>
        </li>
      </ul>
    );

    return (
      <Form horizontal onSubmit={this.onSubmit}>
        <Form.FormGroup>
          <Grid.Col sm={12}>
            <ul className="no-margin-bottom">
              <li>
                Click <strong>Cloud-Meter-role</strong>.{' '}
                <Tooltip delayShow={100} popover={popover}>
                  <Icon type="pf" name="info" size="large" />
                  <span className="sr-only">Steps when selecting a role</span>
                </Tooltip>
              </li>
              <li>
                Copy the <strong>Role ARN</strong> and paste it in the ARN
                field.
              </li>
            </ul>
          </Grid.Col>
        </Form.FormGroup>
        <FormField
          label="ARN"
          error={stepError || accountArnError}
          errorMessage={stepError || accountArnError}
          colLabel={2}
          colField={10}
        >
          <Form.FormControl
            type="text"
            name="arn"
            value={accountArn}
            placeholder="Enter an ARN"
            onChange={this.onChangeAccountArn}
          />
          <Form.HelpBlock>
            ex: arn:aws:iam::123456789012:role/Cloud-Meter-role
          </Form.HelpBlock>
        </FormField>
      </Form>
    );
  }
}

(AccountWizardStepArn as any).propTypes = {
  stepArnValid: PropTypes.bool,
  stepArnErrorMessage: PropTypes.string,
};

(AccountWizardStepArn as any).defaultProps = {
  stepArnValid: false,
  stepArnErrorMessage: null,
};

const mapStateToProps = state => ({ ...state.accountWizard });

const ConnectedAccountWizardStepArn = connect(mapStateToProps)(
  AccountWizardStepArn
);

export {
  ConnectedAccountWizardStepArn as default,
  ConnectedAccountWizardStepArn,
  AccountWizardStepArn,
};
