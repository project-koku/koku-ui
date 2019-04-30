import { List, ListItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, Interpolate, translate } from 'react-i18next';
import { getTestProps, testIds } from 'testIds';
import CheckItem from './checkItem';

interface Props extends InjectedTranslateProps {
  checkedItems: { [k: string]: boolean };
  updateCheckItem: (
    value: boolean,
    event: React.FormEvent<HTMLInputElement>
  ) => void;
}

const SourceKindCheckListBase: React.SFC<Props> = ({
  t,
  checkedItems,
  updateCheckItem,
}) => {
  return (
    <React.Fragment>
      {t('onboarding.source_kind.checklist_title')}
      <CheckItem
        {...getTestProps(testIds.onboarding.check_box_1)}
        isChecked={checkedItems.install_openshift}
        title={t('onboarding.source_kind.checkbox_1')}
        onChange={updateCheckItem}
        id={'install_openshift'}
        ariaLabel={t('onboarding.source_kind.checkbox_1_aria_label')}
      >
        <List>
          <ListItem>
            <a
              target="_blank"
              href="https://docs.openshift.com/container-platform/3.11/getting_started/install_openshift.html"
            >
              {t('onboarding.source_kind.checkbox_1_1')}
            </a>
          </ListItem>
          <ListItem>
            <a
              target="_blank"
              href="https://access.redhat.com/documentation/en-us/openshift_container_platform/3.11/html/configuring_clusters/installing-operator-framework"
            >
              {t('onboarding.source_kind.checkbox_1_2')}
            </a>
          </ListItem>
        </List>
      </CheckItem>
      <CheckItem
        {...getTestProps(testIds.onboarding.check_box_2)}
        isChecked={checkedItems.install_others}
        title={t('onboarding.source_kind.checkbox_2')}
        onChange={updateCheckItem}
        id={'install_others'}
        ariaLabel={t('onboarding.source_kind.checkbox_2_aria_label')}
      >
        <List>
          <ListItem>
            <a
              target="_blank"
              href="https://access.redhat.com/products/red-hat-insights#getstarted"
            >
              {t('onboarding.source_kind.checkbox_2_1')}
            </a>
          </ListItem>
          <ListItem>
            <Interpolate
              i18nKey="onboarding.source_kind.checkbox_2_2"
              ansible={
                <a
                  target="_blank"
                  href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#basics-what-will-be-installed"
                >
                  {t('onboarding.source_kind.ansible')}
                </a>
              }
              epel={
                <a
                  target="_blank"
                  href="https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#basics-what-will-be-installed"
                >
                  {t('onboarding.source_kind.epel')}
                </a>
              }
            />
          </ListItem>
          <ListItem>
            <a
              target="_blank"
              href="https://docs.openshift.com/container-platform/3.11/cli_reference/get_started_cli.html"
            >
              {t('onboarding.source_kind.checkbox_2_3')}
            </a>
          </ListItem>
        </List>
      </CheckItem>
    </React.Fragment>
  );
};

export default translate()(SourceKindCheckListBase);
