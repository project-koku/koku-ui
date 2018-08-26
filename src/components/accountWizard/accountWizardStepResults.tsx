import { Icon, Spinner } from 'patternfly-react';
import PropTypes from 'prop-types';
import React from 'react';

import apiTypes from '../../store/constants/apiConstants';

import { connect } from 'react-redux';

const AccountWizardStepResults = ({
  accountName,
  edit,
  error,
  errorMessage,
  fulfilled,
  pending,
}) => (
  <React.Fragment>
    {error && (
      <div className="wizard-pf-complete blank-slate-pf">
        <div className="wizard-pf-success-icon">
          <Icon type="pf" name="error-circle-o" />
        </div>
        <h3 className="blank-slate-pf-main-action">
          Error {edit ? 'Updating' : 'Creating'} Account
        </h3>
        <p className="blank-slate-pf-secondary-action">{errorMessage}</p>
      </div>
    )}
    {fulfilled && (
      <div className="wizard-pf-complete blank-slate-pf">
        <div className="wizard-pf-success-icon">
          <span className="glyphicon glyphicon-ok-circle" />
        </div>
        <h3 className="blank-slate-pf-main-action">
          <strong>{accountName}</strong> was {edit ? 'updated' : 'created'}.
        </h3>
      </div>
    )}
    {pending && (
      <div className="wizard-pf-process blank-slate-pf">
        <Spinner loading size="lg" className="blank-slate-pf-icon" />
        <h3 className="blank-slate-pf-main-action">
          {edit ? 'Updating' : 'Creating'} Account...
        </h3>
        <p className="blank-slate-pf-secondary-action">
          Please wait while account <strong>{accountName}</strong> is being{' '}
          {edit ? 'updated' : 'created'}.
        </p>
      </div>
    )}
  </React.Fragment>
);

(AccountWizardStepResults as any).propTypes = {
  accountName: PropTypes.string,
  edit: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  fulfilled: PropTypes.bool,
  pending: PropTypes.bool,
};

(AccountWizardStepResults as any).defaultProps = {
  accountName: null,
  edit: false,
  error: false,
  errorMessage: null,
  fulfilled: false,
  pending: false,
};

const mapStateToProps = state => ({
  accountName: state.accountWizard.account[apiTypes.API_SUBMIT_ACCOUNT_NAME],
  ...state.accountWizard,
});

const ConnectedAccountWizardStepResults = connect(mapStateToProps)(
  AccountWizardStepResults
);

export {
  ConnectedAccountWizardStepResults as default,
  ConnectedAccountWizardStepResults,
  AccountWizardStepResults,
};
