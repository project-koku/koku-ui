export interface KeycloakFetcherOptions {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export function createKeycloakFetcher(options: KeycloakFetcherOptions): () => Promise<string> {
  const { tokenUrl, clientId, clientSecret } = options;

  return async () => {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Keycloak token request failed: ${res.status} ${text}`);
    }

    const json = await res.json();
    if (!json.access_token) {
      throw new Error('No access_token in Keycloak response');
    }
    return json.access_token;
  };
}
