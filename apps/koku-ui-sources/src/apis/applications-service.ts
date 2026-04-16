import { API_BASE, axiosInstance } from './axios-client';
import type { Application, CreateApplicationPayload } from './models/applications';

export const APPLICATIONS_PATH = `${API_BASE}/applications`;

export const ApplicationsService = {
  createApplication(data: CreateApplicationPayload): Promise<Application> {
    return axiosInstance.post(APPLICATIONS_PATH, data).then(res => res.data);
  },

  deleteApplication(id: number): Promise<void> {
    return axiosInstance.delete(`${APPLICATIONS_PATH}/${id}`);
  },
};
