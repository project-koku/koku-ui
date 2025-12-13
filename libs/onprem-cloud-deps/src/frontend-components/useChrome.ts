export const useChrome = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateDocumentTitle: (title: string) => {},
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
