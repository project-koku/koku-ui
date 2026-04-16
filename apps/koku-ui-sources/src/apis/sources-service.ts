import { API_BASE, axiosInstance } from './axios-client';
import type { CreateSourcePayload, ListSourcesParams, Source, SourcesListResponse } from './models/sources';

export const SOURCES_PATH = `${API_BASE}/sources`;

export const SourcesService = {
  listSources(params: ListSourcesParams = {}): Promise<SourcesListResponse> {
    return axiosInstance.get(SOURCES_PATH + '/', { params }).then(res => res.data);
  },

  getSource(uuid: string): Promise<Source> {
    return axiosInstance.get(`${SOURCES_PATH}/${uuid}/`).then(res => res.data);
  },

  createSource(data: CreateSourcePayload): Promise<Source> {
    return axiosInstance.post(SOURCES_PATH + '/', data).then(res => res.data);
  },

  updateSource(uuid: string, data: Partial<Source>): Promise<Source> {
    return axiosInstance.patch(`${SOURCES_PATH}/${uuid}/`, data).then(res => res.data);
  },

  deleteSource(uuid: string): Promise<void> {
    return axiosInstance.delete(`${SOURCES_PATH}/${uuid}/`);
  },

  pauseSource(source: Pick<Source, 'uuid'>): Promise<Source> {
    return axiosInstance.patch(`${SOURCES_PATH}/${source.uuid}/`, { paused: true }).then(res => res.data);
  },

  resumeSource(source: Pick<Source, 'uuid'>): Promise<Source> {
    return axiosInstance.patch(`${SOURCES_PATH}/${source.uuid}/`, { paused: false }).then(res => res.data);
  },

  findSourceByName(name: string): Promise<SourcesListResponse> {
    return SourcesService.listSources({ name });
  },
};
