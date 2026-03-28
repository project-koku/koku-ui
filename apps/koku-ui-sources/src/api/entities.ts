import { isAxiosError } from 'axios';
import type { Application, Source, SourcesListResponse } from 'typings/source';

import axios from './api';
import { APPLICATIONS_PATH, SOURCES_PATH } from './constants';

interface ListSourcesParams {
  name?: string;
  type?: string;
  active?: boolean;
  paused?: boolean;
  ordering?: string;
  offset?: number;
  limit?: number;
}

export const listSources = (params: ListSourcesParams = {}): Promise<SourcesListResponse> => {
  return axios.get(SOURCES_PATH + '/', { params }).then(res => res.data);
};

export const getSource = (uuid: string): Promise<Source> => {
  return axios.get(`${SOURCES_PATH}/${uuid}/`).then(res => res.data);
};

export interface CreateSourcePayload {
  name: string;
  source_type: string;
  authentication?: { credentials: Record<string, string> };
  billing_source?: Record<string, unknown>;
}

export const createSource = (data: CreateSourcePayload): Promise<Source> => {
  return axios.post(SOURCES_PATH + '/', data).then(res => res.data);
};

export const updateSource = (uuid: string, data: Partial<Source>): Promise<Source> => {
  return axios.patch(`${SOURCES_PATH}/${uuid}/`, data).then(res => res.data);
};

export const deleteSource = (uuid: string): Promise<void> => {
  return axios.delete(`${SOURCES_PATH}/${uuid}/`);
};

export const pauseSource = (source: Pick<Source, 'uuid'>): Promise<Source> => {
  return axios.patch(`${SOURCES_PATH}/${source.uuid}/`, { paused: true }).then(res => res.data);
};

export const resumeSource = (source: Pick<Source, 'uuid'>): Promise<Source> => {
  return axios.patch(`${SOURCES_PATH}/${source.uuid}/`, { paused: false }).then(res => res.data);
};

export const createApplication = (data: {
  source_id: number;
  application_type_id: number;
  extra: Record<string, any>;
}): Promise<Application> => {
  return axios.post(APPLICATIONS_PATH, data).then(res => res.data);
};

export const deleteApplication = (id: number): Promise<void> => {
  return axios.delete(`${APPLICATIONS_PATH}/${id}`);
};

export const findSourceByName = (name: string): Promise<SourcesListResponse> => listSources({ name });

/** Best-effort message from API error bodies (e.g. DRF `{ detail: "..." }`) for user-visible alerts. */
export const getApiErrorMessage = (err: unknown): string | undefined => {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string' && data.trim()) {
      return data.trim();
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const d = data as Record<string, unknown>;
      if (typeof d.detail === 'string' && d.detail.trim()) {
        return d.detail.trim();
      }
      for (const v of Object.values(d)) {
        if (typeof v === 'string' && v.trim()) {
          return v.trim();
        }
        if (Array.isArray(v) && v.length) {
          const first = v[0];
          if (typeof first === 'string') {
            return first;
          }
        }
      }
    }
    if (err.message) {
      return err.message;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return undefined;
};
