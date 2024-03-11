import {
  Alert,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { SettingsData } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { FetchStatus } from 'store/common';

import { styles } from './tagMappingWizard.styles';

interface TagMappingWizardReviewOwnProps {
  childTags?: SettingsData[];
  parentTags?: SettingsData[];
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
}

type TagMappingWizardReviewProps = TagMappingWizardReviewOwnProps;

const TagMappingWizardReview: React.FC<TagMappingWizardReviewProps> = ({
  childTags = [],
  parentTags = [],
  settingsError,
  settingsStatus,
}: TagMappingWizardReviewProps) => {
  const intl = useIntl();

  const parseApiError = error => {
    if (error.response && error.response.data) {
      if (error.response.data.Error) {
        return error.response.data.Error;
      }
      if (error.response.data.errors) {
        return error.response.data.errors.map(er => `${er.source}: ${er.detail}`).join(', ');
      }
    } else if (error.message) {
      return error.message;
    }
    return 'unknown';
  };

  return (
    <>
      {settingsStatus === FetchStatus.complete && settingsError && (
        <Alert style={styles.alert} title={settingsError ? parseApiError(settingsError) : undefined} variant="danger" />
      )}
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" size={TitleSizes.xl}>
            {intl.formatMessage(messages.tagMappingWizardReview)}
          </Title>
        </StackItem>
        <StackItem>
          <TextContent>
            <Text>
              {intl.formatMessage(messages.tagMappingWizardReviewDesc, {
                create: <strong>{intl.formatMessage(messages.create)}</strong>,
                back: <strong>{intl.formatMessage(messages.back)}</strong>,
              })}
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <TextContent>
            <TextList component={TextListVariants.dl}>
              <TextListItem component={TextListItemVariants.dt}>
                {intl.formatMessage(messages.tagKeyChild)}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                <div style={styles.reviewTable}>
                  <Table
                    aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
                    gridBreakPoint="grid-2xl"
                    variant={TableVariant.compact}
                  >
                    <Thead>
                      <Tr>
                        <Th modifier="nowrap">
                          {intl.formatMessage(messages.detailsResourceNames, { value: 'tag_key' })}
                        </Th>
                        <Th modifier="nowrap">{intl.formatMessage(messages.sourceType)}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {childTags.map((item, index) => (
                        <Tr key={`row-${index}`}>
                          <Td>{item.key}</Td>
                          <Td>
                            {intl.formatMessage(messages.sourceTypes, { value: item?.source_type?.toLowerCase() })}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </TextListItem>
              <TextListItem component={TextListItemVariants.dt}>
                {intl.formatMessage(messages.tagKeyParent)}
              </TextListItem>
              {parentTags.map((val, index) => (
                <TextListItem component={TextListItemVariants.dd} key={`parent-key-${index}`}>
                  {val.key}
                </TextListItem>
              ))}
            </TextList>
          </TextContent>
        </StackItem>
      </Stack>
    </>
  );
};

export { TagMappingWizardReview };
