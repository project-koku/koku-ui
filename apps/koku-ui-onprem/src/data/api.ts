import { createAxiosInstance } from '@koku-ui/ui-lib/api';

export interface UserData {
  username?: string;
  email?: string;
  is_org_admin?: boolean;
}

export interface AccessPermission {
  permission: string;
  resourceDefinitions: {
    attributeFilter: {
      key: string;
      value: string | string[];
      operation: string;
    };
  }[];
}

interface AccessListResponse {
  data: AccessPermission[];
  meta: {
    count: number;
    limit: number;
    offset: number;
  };
}

const ACCESS_PAGE_SIZE = 1000;

export const fetchCurrentUser = (): Promise<UserData> =>
  createAxiosInstance()
    .get<UserData>('/api/me')
    .then(res => res.data);

/** Fetch principal permissions from RBAC V1 /access/ (paginated). */
export const fetchUserPermissions = async (application = ''): Promise<AccessPermission[]> => {
  const axios = createAxiosInstance();
  const permissions: AccessPermission[] = [];
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const { data } = await axios.get<AccessListResponse>('/api/rbac/v1/access/', {
      // On-prem gateway requires `application` (empty string returns all apps).
      params: { application, limit: ACCESS_PAGE_SIZE, offset },
    });

    permissions.push(...data.data);
    total = data.meta.count;
    offset += data.data.length;

    if (data.data.length === 0) {
      break;
    }
  }

  return permissions;
};
