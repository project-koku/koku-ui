import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { createKeycloakFetcher } from '../src/keycloak.ts';

function fakeJwt(exp: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${payload}.sig`;
}

const originalFetch = globalThis.fetch;
const fetchMock = mock.fn<typeof globalThis.fetch>();

describe('createKeycloakFetcher', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    fetchMock.mock.resetCalls();
  });

  function mockFetchResponse(body: unknown, status = 200) {
    globalThis.fetch = fetchMock;
    fetchMock.mock.mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify(body), { status }))
    );
  }

  it('returns a function', () => {
    const fetcher = createKeycloakFetcher({
      tokenUrl: 'https://kc.example.com/realms/test/protocol/openid-connect/token',
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });
    assert.equal(typeof fetcher, 'function');
  });

  it('fetches a token via client_credentials grant', async () => {
    const exp = Math.floor(Date.now() / 1000) + 300;
    const jwt = fakeJwt(exp);
    mockFetchResponse({ access_token: jwt });

    const fetcher = createKeycloakFetcher({
      tokenUrl: 'https://kc.example.com/realms/test/protocol/openid-connect/token',
      clientId: 'test-client',
      clientSecret: 'test-secret',
    });

    const token = await fetcher();
    assert.equal(token, jwt);
  });

  it('sends correct URL, method, and form body', async () => {
    const exp = Math.floor(Date.now() / 1000) + 300;
    mockFetchResponse({ access_token: fakeJwt(exp) });

    const fetcher = createKeycloakFetcher({
      tokenUrl: 'https://kc.example.com:8443/realms/test/protocol/openid-connect/token',
      clientId: 'cid',
      clientSecret: 'csec',
    });
    await fetcher();

    assert.equal(fetchMock.mock.callCount(), 1);
    const [url, init] = fetchMock.mock.calls[0].arguments;
    assert.equal(url, 'https://kc.example.com:8443/realms/test/protocol/openid-connect/token');
    assert.equal(init?.method, 'POST');
    assert.equal(init?.headers?.['Content-Type' as keyof HeadersInit], 'application/x-www-form-urlencoded');

    const bodyParams = new URLSearchParams(init?.body as string);
    assert.equal(bodyParams.get('grant_type'), 'client_credentials');
    assert.equal(bodyParams.get('client_id'), 'cid');
    assert.equal(bodyParams.get('client_secret'), 'csec');
  });

  it('rejects when Keycloak returns HTTP error', async () => {
    globalThis.fetch = fetchMock;
    fetchMock.mock.mockImplementation(() =>
      Promise.resolve(new Response('Unauthorized', { status: 401 }))
    );

    const fetcher = createKeycloakFetcher({
      tokenUrl: 'https://kc.example.com/realms/test/protocol/openid-connect/token',
      clientId: 'cid',
      clientSecret: 'csec',
    });

    await assert.rejects(fetcher(), /token request failed.*401/);
  });

  it('rejects when response has no access_token', async () => {
    mockFetchResponse({ error: 'no token' });

    const fetcher = createKeycloakFetcher({
      tokenUrl: 'https://kc.example.com/realms/test/protocol/openid-connect/token',
      clientId: 'cid',
      clientSecret: 'csec',
    });

    await assert.rejects(fetcher(), /No access_token/);
  });
});
