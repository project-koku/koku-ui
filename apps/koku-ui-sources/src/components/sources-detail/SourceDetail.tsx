import {
  Alert,
  Bullseye,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Label,
  MenuToggle,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { AngleLeftIcon, EllipsisVIcon, RedoIcon } from '@patternfly/react-icons';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { ApiErrorService } from 'apis/api-error-service';
import type { Source } from 'apis/models/sources';
import { getSourceTypeById } from 'apis/source-types';
import { SourcesService } from 'apis/sources-service';
import { SourceRemoveModal } from 'components/modals/SourceRemoveModal';
import { SourceRenameModal } from 'components/modals/SourceRenameModal';
import { CredentialForm } from 'components/sources-detail/CredentialForm';
import { messages } from 'i18n/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { formatRelativeDate } from 'utilities/relative-date';

interface SourceDetailProps {
  uuid: string;
  onBack: () => void;
  canWrite?: boolean;
}

export const SourceDetail: React.FC<SourceDetailProps> = ({ uuid, onBack, canWrite = false }) => {
  const intl = useIntl();
  const addNotification = useAddNotification();
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
      const data = await SourcesService.getSource(uuid);
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
    const wasPausedBefore = source.paused;
    try {
      if (source.paused) {
        await SourcesService.resumeSource(source);
      } else {
        await SourcesService.pauseSource(source);
      }
      await fetchSource();
      addNotification({
        variant: 'success',
        title: intl.formatMessage(
          wasPausedBefore ? messages.resumeToggleSuccessTitle : messages.pauseToggleSuccessTitle
        ),
        dismissable: true,
      });
    } catch (e) {
      const detail = ApiErrorService.getMessage(e);
      const triedResume = source.paused;
      addNotification({
        variant: 'danger',
        title: intl.formatMessage(triedResume ? messages.resumeToggleErrorTitle : messages.pauseToggleErrorTitle),
        description: detail ?? intl.formatMessage(messages.pauseToggleErrorFallback),
        dismissable: true,
      });
    }
  }, [source, fetchSource, intl, addNotification]);

  const handleCheckAvailability = useCallback(async () => {
    if (!uuid) {
      return;
    }
    setCheckingAvailability(true);
    try {
      const data = await SourcesService.getSource(uuid);
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
        <Button variant="link" icon={<AngleLeftIcon />} iconPosition="start" onClick={onBack}>
          {intl.formatMessage(messages.backToIntegrations)}
        </Button>
      </PageSection>
      <PageSection>
        <Flex direction={{ default: 'column' }} gap={{ default: 'gap2xl' }}>
          <FlexItem className="pf-v6-u-mb-md">
            <Flex
              justifyContent={{ default: 'justifyContentSpaceBetween' }}
              alignItems={{ default: 'alignItemsFlexStart' }}
            >
              <FlexItem>
                <Flex spaceItems={{ default: 'spaceItemsMd' }} alignItems={{ default: 'alignItemsCenter' }}>
                  <FlexItem>
                    <Title headingLevel="h1">{source.name}</Title>
                  </FlexItem>
                  <FlexItem>
                    <Label color={statusColor}>{statusLabel}</Label>
                  </FlexItem>
                </Flex>
              </FlexItem>
              <FlexItem>
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
                      onClick={async () => {
                        setIsKebabOpen(false);
                        await handleTogglePause();
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
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>

        {source.paused && (
          <Alert
            variant="warning"
            isInline
            title={intl.formatMessage(messages.sourcePaused)}
            actionLinks={
              <Button
                variant="link"
                isInline
                onClick={async () => {
                  await handleTogglePause();
                }}
                isDisabled={!canWrite}
              >
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

        {/* Compact horizontal description list — PatternFly https://www.patternfly.org/components/description-list#compact-horizontal */}
        <DescriptionList isHorizontal isCompact aria-label={intl.formatMessage(messages.sourceSummary)}>
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

SourceDetail.displayName = 'SourceDetail';
