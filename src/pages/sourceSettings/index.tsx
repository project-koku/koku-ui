import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { onboardingActions } from 'store/onboarding';
import { deleteDialogActions } from 'store/sourceDeleteDialog';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import SourceSettings from './sourceSettings';

export default connect(
  createMapStateToProps(state => ({
    sources: sourcesSelectors.sources(state) || [],
    error: sourcesSelectors.error(state),
    status: sourcesSelectors.status(state),
  })),
  {
    fetch: sourcesActions.fetchSources,
    onAdd: onboardingActions.openModal,
    remove: sourcesActions.removeSource,
    showDeleteDialog: deleteDialogActions.openModal,
  }
)(translate()(SourceSettings));
