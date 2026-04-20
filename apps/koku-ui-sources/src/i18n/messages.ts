import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  addSource: {
    id: 'sources.addSource',
    defaultMessage: 'Add integration',
  },
  emptyStateTitle: {
    id: 'sources.emptyStateTitle',
    defaultMessage: 'Get started by connecting your integrations',
  },
  emptyStateBody: {
    id: 'sources.emptyStateBody',
    defaultMessage: 'Connect an OpenShift cluster to collect usage and cost data.',
  },
  emptyStateAddOpenShift: {
    id: 'sources.emptyStateAddOpenShift',
    defaultMessage: 'Add OpenShift integration',
  },
  emptyStateLogoAlt: {
    id: 'sources.emptyStateLogoAlt',
    defaultMessage: 'OpenShift',
  },
  emptyStateNoMatchesTitle: {
    id: 'sources.emptyStateNoMatchesTitle',
    defaultMessage: 'No integrations match your filters',
  },
  emptyStateNoMatchesBody: {
    id: 'sources.emptyStateNoMatchesBody',
    defaultMessage: 'Try adjusting or clearing your filters to see more results.',
  },
  loadingStateTitle: {
    id: 'sources.loadingStateTitle',
    defaultMessage: 'Looking for integrations...',
  },
  loadingStateDesc: {
    id: 'sources.loadingStateDesc',
    defaultMessage: 'Searching for your integrations. Do not refresh the browser',
  },
  clearAllFilters: {
    id: 'sources.clearAllFilters',
    defaultMessage: 'Clear all filters',
  },
  filterByName: {
    id: 'sources.filterByName',
    defaultMessage: 'Filter by name',
  },
  filterByType: {
    id: 'sources.filterByType',
    defaultMessage: 'Filter by type',
  },
  filterByStatus: {
    id: 'sources.filterByStatus',
    defaultMessage: 'Filter by status',
  },
  filterStatusGroupAria: {
    id: 'sources.filterStatusGroupAria',
    defaultMessage: 'Filter integrations by availability',
  },
  name: {
    id: 'sources.name',
    defaultMessage: 'Name',
  },
  sourceType: {
    id: 'sources.sourceType',
    defaultMessage: 'Type',
  },
  dateAdded: {
    id: 'sources.dateAdded',
    defaultMessage: 'Date added',
  },
  status: {
    id: 'sources.status',
    defaultMessage: 'Status',
  },
  statusAvailable: {
    id: 'sources.statusAvailable',
    defaultMessage: 'Available',
  },
  statusUnavailable: {
    id: 'sources.statusUnavailable',
    defaultMessage: 'Unavailable',
  },
  statusPartiallyAvailable: {
    id: 'sources.statusPartiallyAvailable',
    defaultMessage: 'Partially available',
  },
  statusPaused: {
    id: 'sources.statusPaused',
    defaultMessage: 'Paused',
  },
  filterStatusAny: {
    id: 'sources.filterStatusAny',
    defaultMessage: 'Any',
  },
  sourceTypeOCPLabel: {
    id: 'sources.sourceTypeOCPLabel',
    defaultMessage: 'OpenShift Container Platform',
  },
  sourcesTabTitle: {
    id: 'sources.tabTitle',
    defaultMessage: 'Integrations',
  },
  backToIntegrations: {
    id: 'sources.backToIntegrations',
    defaultMessage: 'Back to Integrations',
  },
  integrationsTableBottomPagination: {
    id: 'sources.integrationsTableBottomPagination',
    defaultMessage: 'Integrations table bottom pagination',
  },
  rename: {
    id: 'sources.rename',
    defaultMessage: 'Rename',
  },
  remove: {
    id: 'sources.remove',
    defaultMessage: 'Remove',
  },
  cancel: {
    id: 'sources.cancel',
    defaultMessage: 'Cancel',
  },
  removeIntegrationModalTitle: {
    id: 'sources.removeIntegrationModalTitle',
    defaultMessage: 'Remove integration?',
  },
  removeIntegrationModalBody: {
    id: 'sources.removeIntegrationModalBody',
    defaultMessage:
      'Removing {name} permanently deletes all collected data and detaches the following connected application:',
  },
  removeIntegrationConnectedCostManagement: {
    id: 'sources.removeIntegrationConnectedCostManagement',
    defaultMessage: 'Cost Management',
  },
  removeIntegrationAcknowledge: {
    id: 'sources.removeIntegrationAcknowledge',
    defaultMessage: 'I acknowledge that this action cannot be undone.',
  },
  removeIntegrationSubmit: {
    id: 'sources.removeIntegrationSubmit',
    defaultMessage: 'Remove integration and its data',
  },
  removeIntegrationGenericError: {
    id: 'sources.removeIntegrationGenericError',
    defaultMessage: 'Failed to remove integration',
  },
  pause: {
    id: 'sources.pause',
    defaultMessage: 'Pause',
  },
  resume: {
    id: 'sources.resume',
    defaultMessage: 'Resume',
  },
  pauseDescription: {
    id: 'sources.pauseDescription',
    defaultMessage: 'Pause data collection for this integration',
  },
  resumeDescription: {
    id: 'sources.resumeDescription',
    defaultMessage: 'Unpause data collection for this integration',
  },
  removeDescription: {
    id: 'sources.removeDescription',
    defaultMessage: 'Permanently delete this integration and all collected data',
  },
  sourcePaused: {
    id: 'sources.sourcePaused',
    defaultMessage: 'Integration paused',
  },
  sourcePausedBody: {
    id: 'sources.sourcePausedBody',
    defaultMessage:
      'No data is being collected for this integration. Turn the integration back on to reestablish connection and data collection.',
  },
  resumeConnection: {
    id: 'sources.resumeConnection',
    defaultMessage: 'Resume connection',
  },
  checkAvailability: {
    id: 'sources.checkAvailability',
    defaultMessage: 'Check integration availability',
  },
  sourceSummary: {
    id: 'sources.sourceSummary',
    defaultMessage: 'Integration summary',
  },
  lastAvailabilityCheck: {
    id: 'sources.lastAvailabilityCheck',
    defaultMessage: 'Last availability check',
  },
  waitingForUpdate: {
    id: 'sources.waitingForUpdate',
    defaultMessage: 'Waiting for update',
  },
  viewDetails: {
    id: 'sources.viewDetails',
    defaultMessage: 'View details',
  },
  sourceNotFound: {
    id: 'sources.sourceNotFound',
    defaultMessage: 'Integration not found',
  },
  nameValidationError: {
    id: 'sources.nameValidationError',
    defaultMessage: 'Name validation failed. Please try again.',
  },
  duplicateSourceName: {
    id: 'sources.duplicateSourceName',
    defaultMessage: 'That name is taken. Try a different name.',
  },
  wizardIntegrationNameStepTitle: {
    id: 'sources.wizardIntegrationNameStepTitle',
    defaultMessage: 'Integration name',
  },
  wizardNamePlaceholder: {
    id: 'sources.wizardNamePlaceholder',
    defaultMessage: 'Enter a name for this integration',
  },
  wizardTitleOcp: {
    id: 'sources.wizardTitleOcp',
    defaultMessage: 'Add an OpenShift integration',
  },
  wizardExitTitle: {
    id: 'sources.wizardExitTitle',
    defaultMessage: 'Exit integration creation?',
  },
  wizardExitBody: {
    id: 'sources.wizardExitBody',
    defaultMessage: 'All inputs will be discarded.',
  },
  wizardErrorCreate: {
    id: 'sources.wizardErrorCreate',
    defaultMessage: 'Failed to create integration',
  },
  wizardErrorAlertTitle: {
    id: 'sources.wizardErrorAlertTitle',
    defaultMessage: 'Error creating integration',
  },
  reviewIntegrationName: {
    id: 'sources.reviewIntegrationName',
    defaultMessage: 'Integration name',
  },
  reviewIntegrationType: {
    id: 'sources.reviewIntegrationType',
    defaultMessage: 'Integration type',
  },
  nameDescriptionWithType: {
    id: 'sources.nameDescriptionWithType',
    defaultMessage: 'Enter a name for your {typeName} integration.',
  },
  nameDescriptionDefault: {
    id: 'sources.nameDescriptionDefault',
    defaultMessage: 'Enter a name for this integration.',
  },
  detailsSectionTitle: {
    id: 'sources.detailsSectionTitle',
    defaultMessage: 'Details',
    description: 'Heading for the card that shows integration credentials and billing fields on the detail page.',
  },
  credentialsUnsupportedSourceType: {
    id: 'sources.credentialsUnsupportedSourceType',
    defaultMessage:
      'This integration type ({type}) is not supported in the UI. Only OpenShift is supported at this time.',
  },
  pauseToggleErrorTitle: {
    id: 'sources.pauseToggleErrorTitle',
    defaultMessage: 'Could not pause integration',
  },
  resumeToggleErrorTitle: {
    id: 'sources.resumeToggleErrorTitle',
    defaultMessage: 'Could not resume integration',
  },
  pauseToggleErrorFallback: {
    id: 'sources.pauseToggleErrorFallback',
    defaultMessage: 'The server rejected the request. Try again later or contact your administrator.',
  },
  pauseToggleSuccessTitle: {
    id: 'sources.pauseToggleSuccessTitle',
    defaultMessage: 'Integration paused',
  },
  resumeToggleSuccessTitle: {
    id: 'sources.resumeToggleSuccessTitle',
    defaultMessage: 'Integration resumed',
  },
  errorBoundaryTitle: {
    id: 'sources.errorBoundaryTitle',
    defaultMessage: 'Something went wrong',
  },
  errorBoundaryUnexpected: {
    id: 'sources.errorBoundaryUnexpected',
    defaultMessage: 'An unexpected error occurred.',
  },
  errorBoundaryTryAgain: {
    id: 'sources.errorBoundaryTryAgain',
    defaultMessage: 'Try again',
  },
  wizardNavStepsAria: {
    id: 'sources.wizardNavStepsAria',
    defaultMessage: 'Wizard steps',
  },
  cancelWizardConfirmationAria: {
    id: 'sources.cancelWizardConfirmationAria',
    defaultMessage: 'Cancel confirmation',
  },
  actions: {
    id: 'sources.actions',
    defaultMessage: 'Actions',
  },
});
