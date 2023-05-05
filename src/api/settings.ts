import axios from 'axios';

export interface SettingsPayload {
  api?: {
    settings?: {
      cost_type?: string;
      currency?: string;
    };
  };
}

export function updatetSettings(payload: SettingsPayload) {
  return axios.post(`settings/`, payload);
}
