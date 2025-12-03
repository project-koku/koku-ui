import messages from '@koku-ui/i18n/locales/messages';
import { ClipboardCopy, EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import { TagIcon } from '@patternfly/react-icons/dist/esm/icons/tag-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { styles } from './noInstances.styles';

interface NoInstancesStateOwnProps {
  // TBD...
}

type NoInstancesStateProps = NoInstancesStateOwnProps & WrappedComponentProps;

class NoInstancesStateBase extends React.Component<NoInstancesStateProps, any> {
  public render() {
    const { intl } = this.props;

    return (
      <EmptyState
        headingLevel="h5"
        icon={TagIcon}
        titleText={intl.formatMessage(messages.noInstancesTitle)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>
          <div>{intl.formatMessage(messages.noInstancesDesc)}</div>
          <div style={styles.clipboardContainer}>
            <div style={styles.tagKey}>
              <span style={styles.tagValueLabel}>{intl.formatMessage(messages.tagKey)}</span>
              <ClipboardCopy
                clickTip={intl.formatMessage(messages.copied)}
                hoverTip={intl.formatMessage(messages.copy)}
                isCode
                isReadOnly
                variant="inline-compact"
              >
                com_redhat_cost_management_compute
              </ClipboardCopy>
            </div>
            <div style={styles.tagValue}>
              <span style={styles.tagValueLabel}>{intl.formatMessage(messages.tagValue)}</span>
              <ClipboardCopy
                clickTip={intl.formatMessage(messages.copied)}
                hoverTip={intl.formatMessage(messages.copy)}
                isCode
                isReadOnly
                variant="inline-compact"
              >
                ec2_compute
              </ClipboardCopy>
            </div>
          </div>
        </EmptyStateBody>
        <EmptyStateFooter>
          <div style={styles.moreInfo}>
            {intl.formatMessage(messages.noInstancesMoreInfo, {
              seeDocumentation: (
                <a href={intl.formatMessage(messages.docsTagMapping)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.seeDocumentation)}
                </a>
              ),
            })}
          </div>
        </EmptyStateFooter>
      </EmptyState>
    );
  }
}

const NoInstancesState = injectIntl(NoInstancesStateBase);

export { NoInstancesState };
