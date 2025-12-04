export const useChrome = () => {
  return {
    updateDocumentTitle: () => {},
    auth: {
      getUser: async () => {
        return {
          identity: {
            user: {
              is_org_admin: true,
            },
          },
        };
      },
    },
  };
};
