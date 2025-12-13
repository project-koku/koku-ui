// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAddNotification = () => (args: any) => {};

export const useClearNotifications = () => () => {};

export const useNotifications = () => ({
  notifications: [],
  clearNotifications: () => {},
  removeNotification: () => {},
  addNotification: () => {},
});

export const useRemoveNotification = () => () => {};
