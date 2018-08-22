import React from 'react';

import AccountWizardStepArn from './accountWizardStepArn';
import AccountWizardStepPolicy from './accountWizardStepPolicy';
import AccountWizardStepResults from './accountWizardStepResults';
import AccountWizardStepRole from './accountWizardStepRole';

const addAccountWizardSteps = [
  {
    step: 1,
    label: '1',
    title: 'Policy',
    // @ts-ignore
    page: <AccountWizardStepPolicy />,
    subSteps: [],
  },
  {
    step: 2,
    label: '2',
    title: 'Role',
    page: <AccountWizardStepRole />,
    subSteps: [],
  },
  {
    step: 3,
    label: '3',
    title: 'ARN',
    // @ts-ignore
    page: <AccountWizardStepArn />,
    subSteps: [],
  },
  {
    step: 4,
    label: '4',
    title: 'Results',
    page: <AccountWizardStepResults />,
    subSteps: [],
  },
];

const editAccountWizardSteps = [];

export { addAccountWizardSteps, editAccountWizardSteps };
