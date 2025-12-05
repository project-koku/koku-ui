export const useAddNotification = () => () => {};

export const useClearNotifications = () => () => {};

export const useNotifications = () => ({
  notifications: [],
  clearNotifications: () => {},
  removeNotification: () => {},
  addNotification: () => {},
});

export const useRemoveNotification = () => () => {};
