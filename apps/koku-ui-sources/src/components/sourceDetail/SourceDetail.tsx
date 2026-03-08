import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { EllipsisVIcon, RedoIcon } from '@patternfly/react-icons';
import { getSource, pauseSource, resumeSource } from 'api/entities';
import { getSourceTypeById } from 'api/sourceTypes';
import { SourceRemoveModal } from 'components/modals/SourceRemoveModal';
import { SourceRenameModal } from 'components/modals/SourceRenameModal';
import { CredentialForm } from 'components/sourceDetail/CredentialForm';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import type { Source } from 'typings/source';
import { formatRelativeDate } from 'utilities/relativeDate';

interface SourceDetailProps {
  uuid: string;
  onBack: () => void;
  canWrite?: boolean;
}

const SourceDetail: React.FC<SourceDetailProps> = ({ uuid, onBack, canWrite = false }) => {
  const intl = useIntl();
  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const fetchSource = useCallback(async () => {
    if (!uuid) {
      return;
    }
    setLoading(true);
    try {
      const data = await getSource(uuid);
      setSource(data);
    } catch {
      setSource(null);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    fetchSource();
  }, [fetchSource]);

  const handleRemoveSuccess = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleRenameSuccess = useCallback(() => {
    fetchSource();
    setIsRenameOpen(false);
  }, [fetchSource]);

  const handleTogglePause = useCallback(async () => {
    if (!source) {
      return;
    }
    try {
      if (source.paused) {
        await resumeSource(source);
      } else {
        await pauseSource(source);
      }
      fetchSource();
    } catch {
      // TODO: error handling
    }
  }, [source, fetchSource]);

  const handleCheckAvailability = useCallback(async () => {
    if (!uuid) {
      return;
    }
    setCheckingAvailability(true);
    try {
      const data = await getSource(uuid);
      setSource(data);
    } catch {
      // status unchanged on failure
    } finally {
      setCheckingAvailability(false);
    }
  }, [uuid]);

  const handleSaveCredentials = useCallback(async (credentials: Record<string, string>) => {
    // TODO: implement credential update API call - credentials will be sent to API
    void credentials;
  }, []);

  if (loading) {
    return (
      <PageSection isFilled>
        <Bullseye>
          <Spinner size="lg" />
        </Bullseye>
      </PageSection>
    );
  }

  if (!source) {
    return (
      <PageSection>
        <Title headingLevel="h2">{intl.formatMessage(messages.sourceNotFound)}</Title>
      </PageSection>
    );
  }

  const sourceType = getSourceTypeById(source.source_type);
  const statusLabel = source.paused ? 'Paused' : source.active ? 'Available' : 'Unavailable';
  const statusColor = source.active && !source.paused ? 'green' : source.paused ? 'orange' : 'red';

  return (
    <>
      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem
            to="#"
            onClick={e => {
              e.preventDefault();
              onBack();
            }}
          >
            {intl.formatMessage(messages.sourcesTabTitle)}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{source.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Title headingLevel="h1">{source.name}</Title>
              <Label color={statusColor}>{statusLabel}</Label>
            </div>
          </div>
          <Dropdown
            isOpen={isKebabOpen}
            onOpenChange={setIsKebabOpen}
            toggle={toggleRef => (
              <MenuToggle
                ref={toggleRef}
                variant="plain"
                onClick={() => setIsKebabOpen(!isKebabOpen)}
                isExpanded={isKebabOpen}
                aria-label="Actions"
              >
                <EllipsisVIcon />
              </MenuToggle>
            )}
            popperProps={{ position: 'right' }}
          >
            <DropdownList>
              <DropdownItem
                isDisabled={!canWrite}
                onClick={() => {
                  setIsKebabOpen(false);
                  handleTogglePause();
                }}
              >
                {source.paused ? intl.formatMessage(messages.resume) : intl.formatMessage(messages.pause)}
              </DropdownItem>
              <DropdownItem
                isDisabled={!canWrite}
                onClick={() => {
                  setIsKebabOpen(false);
                  setIsRenameOpen(true);
                }}
              >
                {intl.formatMessage(messages.rename)}
              </DropdownItem>
              <DropdownItem
                isDisabled={!canWrite}
                onClick={() => {
                  setIsKebabOpen(false);
                  setIsRemoveOpen(true);
                }}
                isDanger
              >
                {intl.formatMessage(messages.remove)}
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>

        {source.paused && (
          <Alert
            variant="warning"
            isInline
            title={intl.formatMessage(messages.sourcePaused)}
            actionLinks={
              <Button variant="link" isInline onClick={handleTogglePause} isDisabled={!canWrite}>
                {intl.formatMessage(messages.resumeConnection)}
              </Button>
            }
            style={{ marginBottom: '16px' }}
          >
            {intl.formatMessage(messages.sourcePausedBody)}
          </Alert>
        )}

        <Title headingLevel="h3" style={{ marginBottom: '16px' }}>
          {intl.formatMessage(messages.sourceSummary)}
        </Title>

        <DescriptionList isHorizontal columnModifier={{ default: '2Col' }}>
          <DescriptionListGroup>
            <DescriptionListTerm>{intl.formatMessage(messages.sourceType)}</DescriptionListTerm>
            <DescriptionListDescription>{sourceType?.product_name ?? source.source_type}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{intl.formatMessage(messages.lastAvailabilityCheck)}</DescriptionListTerm>
            <DescriptionListDescription>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {source.last_polling_time
                  ? formatRelativeDate(source.last_polling_time)
                  : intl.formatMessage(messages.waitingForUpdate)}
                <Button
                  variant="plain"
                  aria-label={intl.formatMessage(messages.checkAvailability)}
                  onClick={handleCheckAvailability}
                  isDisabled={checkingAvailability}
                  size="sm"
                  icon={checkingAvailability ? <Spinner size="md" /> : <RedoIcon />}
                />
              </span>
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{intl.formatMessage(messages.dateAdded)}</DescriptionListTerm>
            <DescriptionListDescription>{formatRelativeDate(source.created_timestamp)}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>

        <CredentialForm source={source} onSave={handleSaveCredentials} />
      </PageSection>

      <SourceRemoveModal
        isOpen={isRemoveOpen}
        source={source}
        onClose={() => setIsRemoveOpen(false)}
        onSuccess={handleRemoveSuccess}
      />
      <SourceRenameModal
        isOpen={isRenameOpen}
        source={source}
        onClose={() => setIsRenameOpen(false)}
        onSuccess={handleRenameSuccess}
      />
    </>
  );
};

export { SourceDetail };
