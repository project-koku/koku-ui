import type { SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Alert, Content, ContentVariants, Stack, StackItem, Title, TitleSizes } from '@patternfly/react-core';
import { Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { AxiosError } from 'axios';
import React from 'react';
import { useIntl } from 'react-intl';

import { FetchStatus } from '../../../../../../store/common';
import { parseApiError } from '../../utils/parseApiError';
import { styles } from './parentTagMapping.styles';

interface ParentTagMappingReviewOwnProps {
  childTags?: SettingsData[];
  parentTags?: SettingsData[];
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
}

type ParentTagMappingReviewProps = ParentTagMappingReviewOwnProps;

const ParentTagMappingReview: React.FC<ParentTagMappingReviewProps> = ({
  childTags = [],
  parentTags = [],
  settingsError,
  settingsStatus,
}: ParentTagMappingReviewProps) => {
  const intl = useIntl();

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
          <Content style={styles.reviewDescContainer}>
            <Content component="p">
              {intl.formatMessage(messages.tagMappingWizardReviewDesc, {
                create: <strong>{intl.formatMessage(messages.create)}</strong>,
                back: <strong>{intl.formatMessage(messages.back)}</strong>,
              })}
            </Content>
          </Content>
        </StackItem>
        <StackItem>
          <Content>
            <Content component={ContentVariants.dl}>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.tagKeyParent)}</Content>
              <Content component={ContentVariants.dd}>{parentTags.map(item => item.key)}</Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.tagKeyParentSource)}</Content>
              <Content component={ContentVariants.dd}>
                {parentTags.map(item =>
                  intl.formatMessage(messages.sourceTypes, { value: item?.source_type?.toLowerCase() })
                )}
              </Content>
              <Content component={ContentVariants.dt}>{intl.formatMessage(messages.tagKeyChild)}</Content>
              <Content component={ContentVariants.dd}>
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
                        <Tr key={`child-row-${index}`}>
                          <Td>{item.key}</Td>
                          <Td>
                            {intl.formatMessage(messages.sourceTypes, { value: item?.source_type?.toLowerCase() })}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </Content>
            </Content>
          </Content>
        </StackItem>
      </Stack>
    </>
  );
};

export { ParentTagMappingReview };
