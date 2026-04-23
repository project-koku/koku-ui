export interface Application {
  id: number;
  source_id: number;
  application_type_id: number;
  extra: Record<string, any>;
}

export interface CreateApplicationPayload {
  source_id: number;
  application_type_id: number;
  extra: Record<string, any>;
}
