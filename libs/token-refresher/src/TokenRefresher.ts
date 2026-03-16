const DEFAULT_BUFFER_SEC = 60;
const FALLBACK_TTL_SEC = 300;

// From Node.js docs: "When delay is larger than 2147483647 or less than 1, the delay will be set to 1."
const MAX_TIMEOUT_MS = 2_147_483_647;

export interface TokenRefresherOptions {
  fetchToken: () => Promise<string>;
  fallbackToken?: string;
  refreshBufferSec?: number;
  logger?: (msg: string) => void;
}

interface CachedToken {
  value: string;
  exp: number;
}

function parseJwtExp(token: string): number {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return 0;
    }
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(Buffer.from(padded, 'base64url').toString());
    return typeof decoded.exp === 'number' ? decoded.exp : 0;
  } catch {
    return 0;
  }
}

export class TokenRefresher {
  private fetchToken: () => Promise<string>;
  private fallbackToken: string;
  private bufferSec: number;
  private log: (msg: string) => void;

  private cache: CachedToken | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private refreshPromise: Promise<string> | null = null;
  private started = false;

  constructor(options: TokenRefresherOptions) {
    this.fetchToken = options.fetchToken;
    this.fallbackToken = options.fallbackToken ?? '';
    this.bufferSec = options.refreshBufferSec ?? DEFAULT_BUFFER_SEC;
    // eslint-disable-next-line no-console
    this.log = options.logger ?? console.log;
  }

  get token(): string {
    if (this.cache && !this.isExpiringSoon()) {
      return this.cache.value;
    }
    this.triggerRefresh();
    return this.cache?.value ?? this.fallbackToken;
  }

  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;

    if (this.fallbackToken) {
      const exp = parseJwtExp(this.fallbackToken);
      if (exp > 0) {
        this.cache = { value: this.fallbackToken, exp };
      }
    }

    this.triggerRefresh();
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.cache = null;
    this.refreshPromise = null;
    this.started = false;
  }

  private isExpiringSoon(): boolean {
    if (!this.cache) {
      return true;
    }
    return Math.floor(Date.now() / 1000) >= this.cache.exp - this.bufferSec;
  }

  private triggerRefresh(): void {
    if (this.refreshPromise) {
      return;
    }

    this.refreshPromise = this.fetchToken()
      .then(token => {
        const exp = parseJwtExp(token);
        const effectiveExp = exp > 0 ? exp : Math.floor(Date.now() / 1000) + FALLBACK_TTL_SEC;
        this.cache = { value: token, exp: effectiveExp };

        const ttl = effectiveExp - Math.floor(Date.now() / 1000);
        this.log(`[token-refresher] Token refreshed, expires in ${ttl}s`);

        this.scheduleNext(effectiveExp);
        return token;
      })
      .catch(err => {
        this.log(`[token-refresher] Refresh failed: ${(err as Error).message}`);
        this.scheduleRetry();
        return this.cache?.value ?? this.fallbackToken;
      })
      .finally(() => {
        this.refreshPromise = null;
      });
  }

  private scheduleNext(exp: number): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const delay = Math.min(Math.max((exp - this.bufferSec - Math.floor(Date.now() / 1000)) * 1000, 0), MAX_TIMEOUT_MS);
    this.timer = setTimeout(() => this.triggerRefresh(), delay);
  }

  private scheduleRetry(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.triggerRefresh(), 30_000);
  }
}
