import * as aboutModalTypes from './aboutModalConstants';
import * as accountTypes from './accountConstants';
import * as applicationStatusTypes from './applicationStatusConstants';
import * as confirmationModalTypes from './confirmationModalConstants';
import * as filterTypes from './filterConstants';
import * as reportTypes from './reportConstants';
import * as systemConfigTypes from './systemConfigConstants';
import * as toastNotificationTypes from './toastNotificationConstants';
import * as userTypes from './userConstants';

const reduxTypes = {
  aboutModal: aboutModalTypes,
  account: accountTypes,
  applicationStatus: applicationStatusTypes,
  confirmationModal: confirmationModalTypes,
  filter: filterTypes,
  report: reportTypes,
  systemConfig: systemConfigTypes,
  toastNotifications: toastNotificationTypes,
  user: userTypes,
};

export {
  reduxTypes as default,
  reduxTypes,
  aboutModalTypes,
  accountTypes,
  applicationStatusTypes,
  confirmationModalTypes,
  filterTypes,
  reportTypes,
  systemConfigTypes,
  toastNotificationTypes,
  userTypes,
};
