import { axiosInstance } from 'api';
import { AccountSettingsType, fetchAccountSettings, updateAccountSettings } from './accountSettings';
import { fetchUserAccess } from './userAccess';
import { ForecastPathsType, ForecastType } from './forecasts/forecast';
import { runForecast } from './forecasts/forecastUtils';
import { ReportPathsType, ReportType } from './reports/report';
import { runReport } from './reports/reportUtils';
import { ResourcePathsType, ResourceType } from './resources/resource';
import { isResourceTypeValid, runResource } from './resources/resourceUtils';
import { RosPathsType, RosType } from './ros/ros';
import { runRosReport } from './ros/rosUtils';

jest.mock('api/ros/recommendations', () => ({
  runRosReport: jest.fn(() => 'recommendation'),
  runRosReports: jest.fn(() => 'recommendations'),
}));

jest.mock('api/reports/ocpReports', () => ({
  runReport: jest.fn(() => 'ocp-report'),
}));

jest.mock('api/reports/ocpCloudReports', () => ({
  runReport: jest.fn(() => 'ocp-cloud-report'),
}));

jest.mock('api/forecasts/ocpForecast', () => ({
  runForecast: jest.fn(() => 'ocp-forecast'),
}));

jest.mock('api/forecasts/ocpCloudForecast', () => ({
  runForecast: jest.fn(() => 'ocp-cloud-forecast'),
}));

jest.mock('api/resources/ocpResource', () => ({
  runResource: jest.fn(() => 'ocp-resource'),
}));

describe('api helpers', () => {
  test('fetchAccountSettings and updateAccountSettings', () => {
    fetchAccountSettings(AccountSettingsType.settings);
    expect(axiosInstance.get).toHaveBeenCalledWith('account-settings/');
    updateAccountSettings(AccountSettingsType.currency, { currency: 'USD' });
    expect(axiosInstance.put).toHaveBeenCalledWith('account-settings/currency/', { currency: 'USD' });
  });

  test('fetchUserAccess without a query', () => {
    fetchUserAccess('');
    expect(axiosInstance.get).toHaveBeenCalledWith('user-access/');
  });

  test('runRosReport routes recommendation and recommendations', () => {
    expect(runRosReport(RosPathsType.recommendation, RosType.ros, 'id')).toBe('recommendation');
    expect(runRosReport(RosPathsType.recommendations, RosType.ros, 'limit=1')).toBe('recommendations');
    expect(runRosReport('unknown' as RosPathsType, RosType.ros, '')).toBeUndefined();
  });

  test('runReport routes ocp and ocp cloud', () => {
    expect(runReport(ReportPathsType.ocp, ReportType.cost, 'q')).toBe('ocp-report');
    expect(runReport(ReportPathsType.ocpCloud, ReportType.cost, 'q')).toBe('ocp-cloud-report');
    expect(runReport('unknown' as ReportPathsType, ReportType.cost, 'q')).toBeUndefined();
  });

  test('runForecast routes ocp and ocp cloud', () => {
    expect(runForecast(ForecastPathsType.ocp, ForecastType.cost, 'q')).toBe('ocp-forecast');
    expect(runForecast(ForecastPathsType.ocpCloud, ForecastType.cost, 'q')).toBe('ocp-cloud-forecast');
    expect(runForecast('unknown' as ForecastPathsType, ForecastType.cost, 'q')).toBeUndefined();
  });

  test('resource type validation and runResource', () => {
    expect(isResourceTypeValid(ResourcePathsType.ocp, ResourceType.project)).toBe(true);
    expect(isResourceTypeValid(ResourcePathsType.ocpCloud, ResourceType.cluster)).toBe(true);
    expect(isResourceTypeValid(ResourcePathsType.ocp, 'unknown' as ResourceType)).toBe(false);
    expect(isResourceTypeValid('aws' as ResourcePathsType, ResourceType.project)).toBe(false);
    expect(runResource(ResourcePathsType.ocp, ResourceType.project, 'q')).toBe('ocp-resource');
    expect(runResource(ResourcePathsType.ocpCloud, ResourceType.node, 'q')).toBe('ocp-resource');
    expect(runResource('aws' as ResourcePathsType, ResourceType.project, 'q')).toBeUndefined();
  });
});
