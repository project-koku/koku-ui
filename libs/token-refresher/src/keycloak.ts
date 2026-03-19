const DEFAULT_MAX_RETRIES = 3;
const RETRYABLE_STATUSES = [502, 503, 504];
const MAX_ERROR_BODY_LEN = 120;
const RETRY_DELAY_MS = 1000;

function sanitizeErrorBody(status: number, text: string): string {
  const trimmed = text.trim();
  const isHtml =
    trimmed.length > 0 &&
    (trimmed.startsWith('<') || trimmed.toLowerCase().includes('<!doctype') || trimmed.toLowerCase().includes('<html'));
  if (isHtml) {
    const statusText = status === 503 ? 'Service Unavailable' : status === 502 ? 'Bad Gateway' : status === 504 ? 'Gateway Timeout' : `HTTP ${status}`;
    return `${statusText} (HTML response; Keycloak may be starting or route has no backend)`;
  }
  if (trimmed.length <= MAX_ERROR_BODY_LEN) {
    return trimmed;
  }
  return `${trimmed.slice(0, MAX_ERROR_BODY_LEN)}...`;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface KeycloakFetcherOptions {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  /** Max retry attempts for 502/503/504. Default 3. Set 0 to disable retries. */
  maxRetries?: number;
}

export function createKeycloakFetcher(options: KeycloakFetcherOptions): () => Promise<string> {
  const { tokenUrl, clientId, clientSecret, maxRetries = DEFAULT_MAX_RETRIES } = options;

  return async () => {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const attempts = maxRetries >= 0 ? maxRetries + 1 : 1;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!res.ok) {
        const text = await res.text();
        const summary = sanitizeErrorBody(res.status, text);
        const err = new Error(`Keycloak token request failed: ${res.status} ${summary}`);
        if (attempt < attempts && RETRYABLE_STATUSES.includes(res.status)) {
          const waitMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          await delay(waitMs);
          continue;
        }
        throw err;
      }

      const json = await res.json();
      if (!json.access_token) {
        throw new Error('No access_token in Keycloak response');
      }
      return json.access_token;
    }

    throw new Error('Keycloak token request failed');
  };
}
