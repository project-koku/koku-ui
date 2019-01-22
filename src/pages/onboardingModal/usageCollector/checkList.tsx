import { Checkbox } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  checkedItems: object;
  updateCheckItem: (
    value: boolean,
    event: React.FormEvent<HTMLInputElement>
  ) => void;
}

const actionItems = [
  {
    id: 'check-ocp-api',
    label: <Interpolate i18nKey="onboarding.korekuta.checkbox_1" />,
    ariaLabel: 'OCP API endpoint https://api.openshift-prod.mycompany.com',
  },
  {
    id: 'check-ocp-metering-operator-token-path',
    label: <Interpolate i18nKey="onboarding.korekuta.checkbox_2" />,
    ariaLabel: 'OCP metering operator token file path',
  },
  {
    id: 'check-ocp-operator-metering-namespace',
    label: <Interpolate i18nKey="onboarding.korekuta.checkbox_3" />,
    ariaLabel: 'OCP Operator Metering namespace',
  },
  {
    id: 'check-super-user-password',
    label: <Interpolate i18nKey="onboarding.korekuta.checkbox_4" />,
    ariaLabel: 'Sudo password for installing dependencies',
  },
];

const UsageCollectorCheckList: React.SFC<Props> = ({
  t,
  checkedItems,
  updateCheckItem,
}) => {
  return (
    <React.Fragment>
      {t('onboarding.korekuta.checklist_title')}
      <br />
      {actionItems.map(actionItem => (
        <Checkbox
          key={`checkbox-key-${actionItem.id}`}
          isChecked={checkedItems[actionItem.id] || false}
          onChange={updateCheckItem}
          label={actionItem.label}
          aria-label={actionItem.ariaLabel}
          id={actionItem.id}
        />
      ))}
      <br />
      <div>{t('onboarding.korekuta.for_example')}</div>
      <br />
      <div>
        # ./ocp_usage.sh --setup -e
        OCP_API="https://api.openshift-prod.mycompany.com" -e
        OCP_METERING_NAMESPACE="metering" -e
        OCP_TOKEN_PATH="/path/to/ocp_usage_token"
      </div>
    </React.Fragment>
  );
};

UsageCollectorCheckList.defaultProps = {
  updateCheckItem: () => null,
};

export default UsageCollectorCheckList;
