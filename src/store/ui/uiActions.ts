import { createAction } from 'typesafe-actions';

export const closeExportModal = createAction('ui/close_export_modal');

export const openExportModal = createAction('ui/open_export_modal');

export const closeProvidersModal = createAction('ui/close_providers_modal');

export const openProvidersModal = createAction('ui/open_providers_modal');

export const toggleSidebar = createAction('ui/toggle_sidebar');
