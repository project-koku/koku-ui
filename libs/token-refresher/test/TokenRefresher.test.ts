import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';
import { TokenRefresher } from '../src/TokenRefresher.ts';

function fakeJwt(exp: number): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  return `${header}.${payload}.sig`;
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

describe('TokenRefresher', () => {
  let refresher: TokenRefresher;

  afterEach(() => {
    refresher?.stop();
  });

  describe('constructor and token getter', () => {
    it('returns empty string when no fallback and not started', () => {
      refresher = new TokenRefresher({ fetchToken: () => Promise.resolve('') });
      assert.equal(refresher.token, '');
    });

    it('returns fallbackToken when not started', () => {
      refresher = new TokenRefresher({
        fetchToken: () => Promise.resolve(''),
        fallbackToken: 'static-fallback',
      });
      assert.equal(refresher.token, 'static-fallback');
    });
  });

  describe('start()', () => {
    it('fetches a token immediately on start', async () => {
      const exp = nowSec() + 300;
      const jwt = fakeJwt(exp);
      const fetchToken = mock.fn(() => Promise.resolve(jwt));

      refresher = new TokenRefresher({ fetchToken });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));

      assert.equal(refresher.token, jwt);
      assert.equal(fetchToken.mock.callCount(), 1);
    });

    it('is idempotent — calling twice does not double-fetch', async () => {
      const exp = nowSec() + 300;
      const fetchToken = mock.fn(() => Promise.resolve(fakeJwt(exp)));

      refresher = new TokenRefresher({ fetchToken });
      refresher.start();
      refresher.start();
      await new Promise(r => setTimeout(r, 50));

      assert.equal(fetchToken.mock.callCount(), 1);
    });

    it('seeds cache from fallbackToken JWT on start', async () => {
      const exp = nowSec() + 300;
      const fallback = fakeJwt(exp);
      const freshJwt = fakeJwt(exp + 600);
      const fetchToken = mock.fn(() => Promise.resolve(freshJwt));

      refresher = new TokenRefresher({ fetchToken, fallbackToken: fallback });
      refresher.start();

      // Synchronously, before fetch resolves, should return fallback
      assert.equal(refresher.token, fallback);
    });
  });

  describe('adaptive scheduling', () => {
    it('schedules refresh based on JWT exp, not fixed interval', async () => {
      const exp = nowSec() + 3; // expires in 3 seconds
      const fetchToken = mock.fn(() => Promise.resolve(fakeJwt(exp)));

      refresher = new TokenRefresher({
        fetchToken,
        refreshBufferSec: 1, // refresh 1s before expiry = at T+2s
      });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));
      assert.equal(fetchToken.mock.callCount(), 1);

      // At T+1s — should NOT have refreshed yet
      await new Promise(r => setTimeout(r, 1000));
      assert.equal(fetchToken.mock.callCount(), 1);

      // At T+2.5s — should have refreshed (scheduled at exp-buffer = T+2s)
      const exp2 = nowSec() + 300;
      fetchToken.mock.mockImplementation(() => Promise.resolve(fakeJwt(exp2)));
      await new Promise(r => setTimeout(r, 1500));
      assert.equal(fetchToken.mock.callCount(), 2);
    });
  });

  describe('stale-while-revalidate', () => {
    it('returns stale token while refresh is in-flight', async () => {
      const exp = nowSec() + 2;
      const staleJwt = fakeJwt(exp);
      let resolveSecond: (v: string) => void;
      const secondFetch = new Promise<string>(r => { resolveSecond = r; });
      let callCount = 0;

      refresher = new TokenRefresher({
        fetchToken: () => {
          callCount++;
          if (callCount === 1) return Promise.resolve(staleJwt);
          return secondFetch;
        },
        refreshBufferSec: 1,
      });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));

      // Wait until refresh triggers but don't resolve it
      await new Promise(r => setTimeout(r, 1500));
      assert.equal(refresher.token, staleJwt); // stale

      // Resolve second fetch
      const freshJwt = fakeJwt(nowSec() + 600);
      resolveSecond!(freshJwt);
      await new Promise(r => setTimeout(r, 50));
      assert.equal(refresher.token, freshJwt);
    });
  });

  describe('error handling', () => {
    it('keeps stale token when refresh fails', async () => {
      const exp = nowSec() + 2;
      const staleJwt = fakeJwt(exp);
      let callCount = 0;

      refresher = new TokenRefresher({
        fetchToken: () => {
          callCount++;
          if (callCount === 1) return Promise.resolve(staleJwt);
          return Promise.reject(new Error('network error'));
        },
        refreshBufferSec: 1,
        logger: () => {}, // suppress test output
      });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));

      // Wait for failed refresh
      await new Promise(r => setTimeout(r, 1500));
      assert.equal(refresher.token, staleJwt);
    });

    it('falls back to fallbackToken when initial fetch fails', async () => {
      refresher = new TokenRefresher({
        fetchToken: () => Promise.reject(new Error('fail')),
        fallbackToken: 'my-fallback',
        logger: () => {},
      });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));

      assert.equal(refresher.token, 'my-fallback');
    });
  });

  describe('stop()', () => {
    it('clears scheduled refresh and resets state', async () => {
      const exp = nowSec() + 300;
      const fetchToken = mock.fn(() => Promise.resolve(fakeJwt(exp)));

      refresher = new TokenRefresher({ fetchToken });
      refresher.start();
      await new Promise(r => setTimeout(r, 50));
      refresher.stop();

      assert.equal(refresher.token, '');
    });
  });
});
