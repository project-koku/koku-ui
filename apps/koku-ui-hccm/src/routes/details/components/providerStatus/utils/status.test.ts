import { ProviderType } from 'api/providers';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';

import { getProviderAvailability, getProviderStatus, lookupKey, StatusType } from './status';

describe('getProviderAvailability', () => {
  test('uses OCP message for OCP sources regardless of case', () => {
    const result = getProviderAvailability({ source_type: 'OCP', active: true, paused: false } as Provider);
    expect(result.msg).toBe(messages.dataDetailsIntegrationStatus);
    expect(result.status).toBe(StatusType.complete);
  });

  test('uses cloud message for AWS-local and other cloud sources', () => {
    expect(getProviderAvailability({ source_type: 'AWS-local', active: true } as Provider).msg).toBe(
      messages.dataDetailsCloudIntegrationStatus
    );
    expect(getProviderAvailability({ source_type: 'AWS', active: true } as Provider).msg).toBe(
      messages.dataDetailsCloudIntegrationStatus
    );
  });

  test('marks inactive sources as failed', () => {
    const result = getProviderAvailability({
      source_type: ProviderType.aws,
      active: false,
      paused: false,
    } as Provider);
    expect(result.status).toBe(StatusType.failed);
  });

  test('marks paused sources and returns undefined without a provider', () => {
    expect(getProviderAvailability({ source_type: ProviderType.aws, paused: true } as Provider).status).toBe(
      StatusType.paused
    );
    expect(getProviderAvailability(undefined as unknown as Provider)).toBeUndefined();
  });
});

describe('lookupKey and getProviderStatus', () => {
  test.each([
    ['complete', StatusType.complete],
    ['FAILED', StatusType.failed],
    ['in_progress', StatusType.inProgress],
    ['paused', StatusType.paused],
    ['pending', StatusType.pending],
    ['something-else', StatusType.none],
  ])('lookupKey(%s)', (value, expected) => {
    expect(lookupKey(value)).toBe(expected);
  });

  test('returns undefined without a provider', () => {
    expect(getProviderStatus(undefined as unknown as Provider)).toBeUndefined();
  });

  test('prefers failed download state and uses the retrieval message', () => {
    const result = getProviderStatus({
      status: {
        download: { state: 'failed', end: '2026-01-02' },
        processing: { state: 'complete' },
        summary: { state: 'complete' },
      },
    } as Provider);

    expect(result.status).toBe(StatusType.failed);
    expect(result.msg).toBe(messages.dataDetailsRetrieval);
    expect(result.lastUpdated).toBe('2026-01-02');
  });

  test('reports in-progress processing and pending summary', () => {
    expect(
      getProviderStatus({
        status: {
          download: { state: 'complete' },
          processing: { state: 'in_progress', start: '2026-01-03' },
          summary: { state: 'complete' },
        },
      } as Provider).status
    ).toBe(StatusType.inProgress);

    expect(
      getProviderStatus({
        status: {
          download: { state: 'complete' },
          processing: { state: 'complete' },
          summary: { state: 'pending' },
        },
      } as Provider)
    ).toMatchObject({ status: StatusType.pending, msg: messages.dataDetailsIntegrationAndFinalization });
  });

  test('skips summary state for cloud providers and reports complete', () => {
    const result = getProviderStatus(
      {
        status: {
          download: { state: 'complete' },
          processing: { state: 'complete' },
          summary: { state: 'failed' },
        },
      } as Provider,
      true
    );

    expect(result.status).toBe(StatusType.complete);
    expect(result.msg).toBe(messages.dataDetailsIntegrationAndFinalization);
  });

  test('reports none when no processing states exist', () => {
    expect(getProviderStatus({ status: {} } as Provider).status).toBe(StatusType.none);
  });
});
