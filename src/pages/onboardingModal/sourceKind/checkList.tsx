import { Checkbox } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  checkedItems: object;
  updateCheckItem?: (
    value: boolean,
    event: React.FormEvent<HTMLInputElement>
  ) => void;
  checkAll?: (value: boolean, event: React.FormEvent<HTMLInputElement>) => void;
}

const actionItems = [
  {
    id: 'check-ocp-version',
    label: <Interpolate i18nKey="onboarding.source_kind.checkbox_1" />,
    ariaLabel: 'OCP version 3.11 or newer',
  },
  {
    id: 'check-operator-metering',
    label: (
      <Interpolate
        i18nKey="onboarding.source_kind.checkbox_2"
        operator={
          <a
            target="_blank"
            href="https://github.com/operator-framework/operator-metering/blob/master/Documentation/install-metering.md"
          >
            Operator Metering
          </a>
        }
      />
    ),
    ariaLabel: 'Install operator metering',
  },
  {
    id: 'check-insights-client',
    label: (
      <Interpolate
        i18nKey="onboarding.source_kind.checkbox_3"
        insights={
          <a
            target="_blank"
            href="https://access.redhat.com/products/red-hat-insights/#getstarted"
          >
            Red Hat Insights Client
          </a>
        }
      />
    ),
    ariaLabel: 'Setup Red Hat Insights Client',
  },
  {
    id: 'check-ansible-epel',
    label: (
      <Interpolate
        i18nKey="onboarding.source_kind.checkbox_4"
        ansible={
          <a
            target="_blank"
            href="https://docs.ansible.com/ansible/2.7/installation_guide/intro_installation.html"
          >
            Ansible
          </a>
        }
        epel={
          <a
            target="_blank"
            href="https://fedoraproject.org/wiki/EPEL#Quickstart"
          >
            EPEL repository
          </a>
        }
      />
    ),
    ariaLabel: 'Install Ansible and EPEL',
  },
  {
    id: 'check-oc',
    label: (
      <Interpolate
        i18nKey="onboarding.source_kind.checkbox_5"
        oc={
          <a
            target="_blank"
            href="https://docs.openshift.com/container-platform/3.3/cli_reference/get_started_cli.html#cli-linux"
          >
            OCP command-line (oc)
          </a>
        }
      />
    ),
    ariaLabel: 'Install OCP command line',
  },
];

const SourceKindCheckList: React.SFC<Props> = ({
  t,
  checkedItems,
  updateCheckItem,
  checkAll,
}) => {
  return (
    <React.Fragment>
      {t('onboarding.source_kind.checklist_title')}
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
      <Checkbox
        key={'checkbox-all-sourcekind'}
        onChange={checkAll}
        isChecked={Object.keys(checkedItems).every(k => checkedItems[k])}
        label={t('onboarding.source_kind.checkbox_6')}
        aria-label={t('onboarding.source_kind.check them all')}
        id="check-them-all"
      />
    </React.Fragment>
  );
};

SourceKindCheckList.defaultProps = {
  updateCheckItem: () => null,
  checkAll: () => null,
};

export default SourceKindCheckList;
