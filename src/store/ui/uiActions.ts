import { createAction } from 'typesafe-actions';

export const closeProvidersModal = createAction('ui/close_providers_modal');

export const openProvidersModal = createAction('ui/open_providers_modal');

export const toggleSidebar = createAction('ui/toggle_sidebar');
