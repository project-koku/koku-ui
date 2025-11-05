import { ClipboardCopy, EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { OptimizationIcon } from 'routes/components/icons/optimizationIcon';

interface NotConfiguredStateOwnProps {
  // TBD...
}

type NotConfiguredStateProps = NotConfiguredStateOwnProps;

const NotConfiguredState: React.FC<NotConfiguredStateProps> = () => {
  const intl = useIntl();

  const getCliClipboard = () => {
    return (
      <ClipboardCopy
        clickTip={intl.formatMessage(messages.copyToClipboardSuccessfull)}
        hoverTip={intl.formatMessage(messages.copyToClipboard)}
        isCode
        toggleAriaLabel={intl.formatMessage(messages.copyToClipboard)}
      >
        oc label namespace NAMESPACE cost_management_optimizations="true" --overwrite="true"
      </ClipboardCopy>
    );
  };

  const getNamespaceClipboard = () => {
    return (
      <ClipboardCopy
        clickTip={intl.formatMessage(messages.copyToClipboardSuccessfull)}
        hoverTip={intl.formatMessage(messages.copyToClipboard)}
        isCode
        toggleAriaLabel={intl.formatMessage(messages.copyToClipboard)}
      >
        cost_management_optimizations="true"
      </ClipboardCopy>
    );
  };

  return (
    <EmptyState
      headingLevel="h1"
      icon={OptimizationIcon as any}
      titleText={intl.formatMessage(messages.notConfiguredTitle)}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
    >
      <EmptyStateBody>{intl.formatMessage(messages.notConfiguredDesc)}</EmptyStateBody>
      <EmptyStateBody>
        {intl.formatMessage(messages.notConfiguredNamespace, { clipboard: getNamespaceClipboard() })}
      </EmptyStateBody>
      <EmptyStateBody>{intl.formatMessage(messages.notConfiguredCli, { clipboard: getCliClipboard() })}</EmptyStateBody>
      <EmptyStateBody>
        {intl.formatMessage(messages.notConfiguredChanges, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsOptimizations)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
      </EmptyStateBody>
    </EmptyState>
  );
};

export { NotConfiguredState };
