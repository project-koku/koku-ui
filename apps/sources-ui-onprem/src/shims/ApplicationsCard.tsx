import { Card, CardBody, CardTitle, Dropdown, DropdownItem, DropdownList, MenuToggle, Switch, Tooltip } from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useSource } from 'sources-ui/src/hooks/useSource';
import { ApplicationLabel } from 'sources-ui/src/views/formatters';

/**
 * On-prem pause and remove apply to the integration. The Applications card stays
 * visible, and its switch and kebab do not call pauseApplication or deleteApplication.
 */
const ApplicationsCard = () => {
  const intl = useIntl();
  const source = useSource();
  const appTypes = useSelector(({ sources }: { sources?: { appTypes?: { id: string; display_name: string }[] } }) => sources?.appTypes);
  const application = source?.applications?.[0];

  if (!source || !application) {
    return null;
  }

  const appType = appTypes?.find(type => type.id === application.application_type_id);
  const label = appType?.display_name || 'Cost Management';
  const unavailable = intl.formatMessage({
    id: 'sources.onpremApplicationActionsDisabled',
    defaultMessage: 'Pause and remove are available on the integration, not on this application.',
  });

  return (
    <Card className="src-c-card-applications pf-v6-u-m-lg pf-v6-u-mr-sm-on-md pf-v6-u-p-lg pf-v6-u-pl-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.applications.title',
          defaultMessage: 'Applications',
        })}
      </CardTitle>
      <CardBody>
        <div className="pf-v6-c-form src-c-applications_form">
          <div className="src-c-application_flex">
            <Tooltip content={unavailable}>
              <span>
                <Switch
                  className="src-c-application_switch"
                  id={`app-switch-${application.application_type_id}`}
                  label={label}
                  isChecked={!application.paused_at}
                  isDisabled
                />
              </span>
            </Tooltip>
            <ApplicationLabel className="pf-v6-u-ml-sm src-m-clickable" app={application} showStatusText />
            <ApplicationActionsMenu label={unavailable} paused={Boolean(application.paused_at)} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const ApplicationActionsMenu = ({ label, paused }: { label: string; paused: boolean }) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(false);
  const actionLabel = paused
    ? intl.formatMessage({ id: 'app.kebab.resume.button', defaultMessage: 'Resume' })
    : intl.formatMessage({ id: 'app.kebab.pause.button', defaultMessage: 'Pause' });

  const item = (key: string, text: string) => (
    <DropdownItem key={key} isDisabled tooltipProps={{ content: label }}>
      {text}
    </DropdownItem>
  );

  // Do not use src-c-dropdown__application_kebab here. PatternFly 6.6 copies a
  // Dropdown className onto the menu, and that class sets max-height: 32px plus
  // margin-left: auto, which clips the menu and pins the toggle to the right.
  return (
    <Dropdown
      isPlain
      isOpen={isOpen}
      popperProps={{ position: 'right' }}
      onOpenChange={setOpen}
      toggle={toggleRef => (
        <MenuToggle
          ref={toggleRef}
          aria-label="Actions"
          variant="plain"
          onClick={() => setOpen(prev => !prev)}
          isExpanded={isOpen}
          icon={<EllipsisVIcon />}
        />
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        {item(paused ? 'resume' : 'pause', actionLabel)}
        {item(
          'remove',
          intl.formatMessage({
            id: 'app.kebab.remove.button',
            defaultMessage: 'Remove',
          })
        )}
      </DropdownList>
    </Dropdown>
  );
};

export default ApplicationsCard;
