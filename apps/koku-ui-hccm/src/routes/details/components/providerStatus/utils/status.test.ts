import { ProviderType } from 'api/providers';
import type { Provider } from 'api/providers';
import messages from 'locales/messages';

import { getProviderAvailability, StatusType } from './status';

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
});
