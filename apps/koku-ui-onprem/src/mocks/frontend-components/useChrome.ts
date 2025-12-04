export const useChrome = () => {
  return {
    updateDocumentTitle: () => {},
    auth: {
      getUser: async () => {
        return {
          indentity: {
            user: {
              is_org_admin: true,
            },
          },
        };
      },
    },
  };
};
