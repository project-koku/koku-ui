export const isOrgAdmin = async auth => {
  const data: any = await auth.getUser();
  try {
    return !!data?.identity.user?.is_org_admin;
  } catch {
    return false;
  }
};
