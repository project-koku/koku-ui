const SOURCE_TYPE_ROTATION = ['OCP', 'AWS', 'Azure', 'GCP'] as const;

export type MockSourceSourceType = (typeof SOURCE_TYPE_ROTATION)[number];

export interface MockSourceRow {
  id: number;
  uuid: string;
  name: string;
  source_type: MockSourceSourceType;
  authentication: {
    credentials: {
      cluster_id?: string;
      role_arn?: string;
      subscription_id?: string;
      client_id?: string;
      tenant_id?: string;
      project_id?: string;
    };
  };
  billing_source: {
    data_source: {
      bucket?: string;
      region?: string;
      resource_group?: string;
      storage_account?: string;
      dataset?: string;
      table_id?: string;
    };
  } | null;
  provider_linked: boolean;
  active: boolean;
  paused: boolean;
  current_month_data: boolean;
  previous_month_data: boolean;
  has_data: boolean;
  created_timestamp: string;
}

const UUID_PREFIX = '00000000-0000-4000-8000-';

function deterministicUuid(id: number): string {
  const hex = id.toString(16).toUpperCase().padStart(12, '0');
  return `${UUID_PREFIX}${hex}`;
}

function buildRow(id: number): MockSourceRow {
  const source_type = SOURCE_TYPE_ROTATION[(id - 1) % 4];
  const name = `Integration ${id}`;
  const uuid = deterministicUuid(id);
  const day = String(((id - 1) % 28) + 1).padStart(2, '0');
  const created_timestamp = `2026-01-${day}T10:30:00Z`;

  const base: Omit<MockSourceRow, 'authentication' | 'billing_source' | 'source_type'> = {
    id,
    uuid,
    name,
    provider_linked: true,
    active: true,
    paused: false,
    current_month_data: true,
    previous_month_data: id % 2 === 1,
    has_data: true,
    created_timestamp,
  };

  if (source_type === 'OCP') {
    return {
      ...base,
      source_type,
      authentication: { credentials: { cluster_id: `integration-cluster-${id}` } },
      billing_source: null,
    };
  }

  if (source_type === 'AWS') {
    const accountId = String(100000000000 + id).slice(0, 12);
    return {
      ...base,
      source_type,
      authentication: {
        credentials: { role_arn: `arn:aws:iam::${accountId}:role/CostManagement` },
      },
      billing_source: {
        data_source: { bucket: 'my-cost-bucket', region: 'us-east-1' },
      },
    };
  }

  if (source_type === 'Azure') {
    const subSuffix = id.toString(16).padStart(12, '0');
    return {
      ...base,
      source_type,
      authentication: {
        credentials: {
          subscription_id: `00000000-0000-0000-0000-${subSuffix}`,
          client_id: `azure-client-${id}`,
          tenant_id: `azure-tenant-${id}`,
        },
      },
      billing_source: {
        data_source: {
          resource_group: `rg-integration-${id}`,
          storage_account: `saint${id}`,
        },
      },
    };
  }

  return {
    ...base,
    source_type: 'GCP',
    authentication: {
      credentials: { project_id: `gcp-integration-project-${id}` },
    },
    billing_source: {
      data_source: {
        dataset: `billing_export_${id}`,
        table_id: `gcp_billing_${id}`,
      },
    },
  };
}

export function buildSourcesDataset(count: number): MockSourceRow[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => buildRow(i + 1));
}
