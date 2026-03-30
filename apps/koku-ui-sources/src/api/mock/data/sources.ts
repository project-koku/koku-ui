import type { Source } from 'typings/source';

export const mockSources: Source[] = [
  {
    id: 1,
    uuid: '11111111-1111-1111-1111-111111111111',
    name: 'My OpenShift Cluster',
    source_type: 'OCP',
    authentication: { credentials: { cluster_id: 'test-cluster-001' } },
    billing_source: null,
    provider_linked: true,
    active: true,
    paused: false,
    current_month_data: true,
    previous_month_data: true,
    has_data: true,
    created_timestamp: '2026-01-15T10:30:00Z',
  },
  {
    id: 2,
    uuid: '22222222-2222-2222-2222-222222222222',
    name: 'AWS Production Account',
    source_type: 'AWS',
    authentication: { credentials: { role_arn: 'arn:aws:iam::123456789012:role/CostManagement' } },
    billing_source: { data_source: { bucket: 'my-cost-bucket', region: 'us-east-1' } },
    provider_linked: true,
    active: true,
    paused: false,
    current_month_data: true,
    previous_month_data: false,
    has_data: true,
    created_timestamp: '2026-02-20T14:15:00Z',
  },
];
