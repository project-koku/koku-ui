export interface Source {
  id: number;
  uuid: string;
  name: string;
  source_type: string;
  authentication: Record<string, any>;
  billing_source: Record<string, any> | null;
  cost_models?: { name: string; uuid: string }[];
  infrastructure?: { uuid: string; type: string; name: string };
  provider_linked: boolean;
  active: boolean;
  paused: boolean;
  current_month_data: boolean;
  previous_month_data: boolean;
  has_data: boolean;
  status?: Record<string, any>;
  last_payload_received_at?: string;
  last_polling_time?: string;
  created_timestamp?: string;
  additional_context?: Record<string, any>;
}

export interface SourcesListResponse {
  meta: { count: number };
  links: { first: string; next: string | null; previous: string | null; last: string };
  data: Source[];
}

export interface SourceType {
  id: string;
  name: string;
  product_name: string;
  category: 'Red Hat';
}

export interface ListSourcesParams {
  name?: string;
  type?: string;
  active?: boolean;
  paused?: boolean;
  ordering?: string;
  offset?: number;
  limit?: number;
}

export interface CreateSourcePayload {
  name: string;
  source_type: string;
  authentication?: { credentials: Record<string, string> };
  billing_source?: Record<string, unknown>;
}
