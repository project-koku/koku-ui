#!/usr/bin/env -S node --experimental-strip-types --no-warnings=ExperimentalWarning

/**
 * start-onprem-auth.mts
 *
 * Starts the on-prem UI dev server behind a local oauth2-proxy container,
 * replicating the production auth stack (login screen, real sessions, logout redirect).
 *
 * Prerequisites:
 *   - Podman or Docker with daemon running
 *   - Run via: npm run start:onprem:auth
 *     (sources setup-onprem-env.sh first, which requires `oc` login)
 *
 * Optional environment overrides:
 *   CONTAINER_RUNTIME     Path to podman or docker binary     (default: auto-detected via PATH)
 *   ONPREM_AUTH_PORT      Port oauth2-proxy listens on        (default: 9002)
 *   ONPREM_UI_PORT        Port webpack dev server listens on  (default: 9001)
 *   KEYCLOAK_NAMESPACE    Namespace of Keycloak secrets       (default: keycloak)
 *   COST_NAMESPACE        Namespace of cost-onprem resources  (default: cost-onprem)
 */

import { type ChildProcess, spawn as cpSpawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { rm, writeFile } from 'node:fs/promises';
import https from 'node:https';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const AUTH_PORT = process.env.ONPREM_AUTH_PORT ?? '9002';
const UI_PORT = process.env.ONPREM_UI_PORT ?? '9001';
const KC_NS = process.env.KEYCLOAK_NAMESPACE ?? 'keycloak';
const COST_NS = process.env.COST_NAMESPACE ?? 'cost-onprem';
const LOCAL_REDIRECT_URI = `http://localhost:${AUTH_PORT}/oauth2/callback`;

// ---------------------------------------------------------------------------
// Logging — ANSI colours; stripped in non-TTY environments (CI pipes)
// ---------------------------------------------------------------------------

const tty = process.stdout.isTTY;

const C = tty
  ? {
      reset: '\x1b[0m',
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      cyan: '\x1b[1;36m',
      green: '\x1b[0;32m',
      yellow: '\x1b[0;33m',
      red: '\x1b[0;31m',
    }
  : { reset: '', bold: '', dim: '', cyan: '', green: '', yellow: '', red: '' };

const log = {
  step: (m: string) => process.stdout.write(`${C.cyan}▶ ${m}${C.reset}\n`),
  info: (m: string) => process.stdout.write(`${C.green}  ✔ ${m}${C.reset}\n`),
  dim: (m: string) => process.stdout.write(`${C.dim}  · ${m}${C.reset}\n`),
  warn: (m: string) => process.stderr.write(`${C.yellow}  ⚠ ${m}${C.reset}\n`),
  fail: (m: string): never => {
    process.stderr.write(`${C.bold}${C.red}✖ Error: ${m}${C.reset}\n`);
    throw new Error(m);
  },
};

// ---------------------------------------------------------------------------
// Process helpers
// ---------------------------------------------------------------------------

/** Resolves after `ms` milliseconds. */
const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

interface StreamOpts {
  nothrow?: boolean;
  env?: NodeJS.ProcessEnv;
}

/**
 * Tagged template helper that splits literal parts on whitespace into tokens
 * while keeping each interpolated value as one atomic argument — safe even when
 * values contain spaces (file paths, namespace names, etc.).
 *
 * Usage:
 *   await shell`oc get secret ${secretName} -n ${KC_NS} -o jsonpath={.data.CLIENT_ID}`
 *
 * Runs the command and captures stdout. Both stdout and stderr are suppressed
 * from the terminal. Rejects with an Error on non-zero exit.
 */
function shell(parts: TemplateStringsArray, ...values: string[]): Promise<string> {
  const argv: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    argv.push(...parts[i].trim().split(/\s+/).filter(Boolean));
    if (i < values.length) {
      argv.push(values[i]);
    } // never split interpolated values
  }
  const [cmd, ...args] = argv;
  return new Promise((resolve, reject) => {
    const proc = cpSpawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout?.on('data', (d: Buffer) => {
      stdout += d;
    });
    proc.stderr?.on('data', (d: Buffer) => {
      stderr += d;
    });
    proc.on('error', reject);
    proc.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`${cmd} exited with code ${code}: ${stderr.trim()}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

/**
 * Runs a command in the foreground with all I/O inherited from the current
 * process (output streams to the terminal). Returns the exit code.
 * Pass nothrow: true to resolve instead of reject on non-zero exit.
 */
function stream(cmd: string, args: string[], { nothrow = false, env }: StreamOpts = {}): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = cpSpawn(cmd, args, { stdio: 'inherit', env: env ?? process.env });
    proc.on('error', reject);
    proc.on('close', (code: number | null) => {
      if (!nothrow && code !== 0) {
        reject(new Error(`${cmd} exited with code ${code}`));
      } else {
        resolve(code ?? 0);
      }
    });
  });
}

/**
 * Starts a command in the background, streaming its I/O to the terminal.
 * Returns the ChildProcess so callers can kill it and watch for exit.
 */
function background(cmd: string, args: string[], env?: NodeJS.ProcessEnv): ChildProcess {
  return cpSpawn(cmd, args, { stdio: 'inherit', env: env ?? process.env });
}

/** Resolves to the full path of `name` if found in PATH, otherwise null. */
async function findInPath(name: string): Promise<string | null> {
  return shell`which ${name}`.then(s => s.trim() || null).catch(() => null);
}

/** Decodes a base64-encoded OpenShift secret field value to a UTF-8 string. */
function fromBase64(b64: string): string {
  return Buffer.from(b64.trim(), 'base64').toString('utf8');
}

/**
 * Reads a single field from a named OpenShift secret, base64-decoding the value.
 */
async function readSecretField(secret: string, ns: string, field: string): Promise<string> {
  const jsonpath = `jsonpath={.data.${field}}`;
  return fromBase64(await shell`oc get secret ${secret} -n ${ns} -o ${jsonpath}`);
}

// ---------------------------------------------------------------------------
// Mutable state — shared between step functions and cleanup
// ---------------------------------------------------------------------------

let containerRuntime = '';
let kcCaCertFile = '';
let webpackChild: ChildProcess | null = null;
let cleaningUp = false;

interface KcAdminContext {
  baseUrl: string;
  realm: string;
  adminUser: string;
  adminPass: string;
  clientUuid: string;
}
let kcAdminCtx: KcAdminContext | null = null;
let kcRedirectUriAdded = false;

interface KcClient {
  id: string;
  clientId: string;
  redirectUris?: string[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Step functions
// ---------------------------------------------------------------------------

interface RuntimeInfo {
  runtime: string;
  upstreamHost: string;
  extraFlags: string[];
}

/**
 * Resolves the container runtime binary. Honours `CONTAINER_RUNTIME` if set;
 * otherwise probes PATH for `podman` then `docker`. Only `podman` and `docker`
 * are supported — other runtimes use incompatible CLI flags. Returns the binary
 * path, the correct hostname alias for the host machine from inside the
 * container, and any extra `run` flags required by the runtime.
 */
async function detectContainerRuntime(): Promise<RuntimeInfo> {
  log.step('Detecting container runtime');

  const runtime =
    process.env.CONTAINER_RUNTIME ??
    (await findInPath('podman')) ??
    (await findInPath('docker')) ??
    log.fail('no container runtime found — install Podman or Docker, or set CONTAINER_RUNTIME=/path/to/podman');

  const name = runtime.split('/').at(-1) ?? runtime;

  if (name !== 'podman' && name !== 'docker') {
    log.fail(
      `unsupported container runtime: "${name}" — only podman and docker are supported. ` +
        `Fix: unset CONTAINER_RUNTIME or point it to a podman/docker binary.`
    );
  }

  log.info(`${name} (${runtime})`);

  const isPodman = name === 'podman';
  return {
    runtime,
    upstreamHost: isPodman ? 'host.containers.internal' : 'host.docker.internal',
    // --add-host is a no-op on Docker for Mac/Windows; required on Docker for Linux
    extraFlags: isPodman ? [] : ['--add-host=host.docker.internal:host-gateway'],
  };
}

/**
 * Guards against being invoked without the cluster env already sourced.
 * `API_PROXY_URL` is exported by `setup-onprem-env.sh`; its absence means
 * the script was called directly instead of through `npm run start:onprem:auth`.
 */
function validateClusterEnv(): void {
  log.step('Validating cluster environment');
  if (!process.env.API_PROXY_URL) {
    log.fail('API_PROXY_URL is not set — run via "npm run start:onprem:auth" which sources setup-onprem-env.sh first');
  }
  log.info(`API_PROXY_URL: ${process.env.API_PROXY_URL}`);
}

interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

/**
 * Reads the `CLIENT_ID` and `CLIENT_SECRET` for the `cost-management-ui`
 * Keycloak client from the `keycloak-client-secret-cost-management-ui` secret
 * in the Keycloak namespace. Values are base64-encoded in the secret.
 */
async function readUiClientCredentials(): Promise<ClientCredentials> {
  log.step('Reading cost-management-ui client credentials');
  const secret = 'keycloak-client-secret-cost-management-ui';

  const clientId = await readSecretField(secret, KC_NS, 'CLIENT_ID');
  const clientSecret = await readSecretField(secret, KC_NS, 'CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    log.fail(`could not read credentials from ${secret} in ${KC_NS}`);
  }

  log.info(`secret ${secret} (ns: ${KC_NS})`);
  return { clientId, clientSecret };
}

/**
 * Fetches the Keycloak CA certificate from the `keycloak-ca-cert` secret in
 * the cost-onprem namespace, writes it to a temp file (mode 0600), and returns
 * the path. The file is removed during `cleanup()`.
 */
async function fetchKeycloakCaCert(): Promise<string> {
  log.step('Fetching Keycloak CA certificate');

  const b64 = (await shell`oc get secret keycloak-ca-cert -n ${COST_NS} -o jsonpath={.data.ca\\.crt}`).trim();
  if (!b64) {
    log.fail(`keycloak CA cert is empty — check secret keycloak-ca-cert in ${COST_NS}`);
  }

  const certPath = join(tmpdir(), `keycloak-ca-${Date.now()}.crt`);
  await writeFile(certPath, Buffer.from(b64, 'base64'), { mode: 0o600 });

  log.info(`saved to ${certPath}`);
  return certPath;
}

/**
 * Generates a cryptographically random 32-byte cookie secret encoded as
 * base64url, suitable for the `--cookie-secret` flag of oauth2-proxy.
 */
function generateCookieSecret(): string {
  return randomBytes(32).toString('base64url');
}

interface ProxyConfig {
  image: string;
  args: string[];
}

/**
 * Minimal HTTPS JSON helper for Keycloak admin API calls.
 * Note: TLS verification is intentionally disabled — the Keycloak admin
 * endpoint is served behind the cluster's ingress CA which may not be
 * trusted by Node.js's bundled CA store, and obtaining it would add another
 * `oc` round-trip. This is acceptable for a local dev script on your own cluster.
 */
async function kcFetch<T = unknown>(
  url: string,
  method: string,
  token: string | null,
  body?: string,
  contentType = 'application/json'
): Promise<T> {
  const headers: Record<string, string> = { 'content-type': contentType };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  if (body) {
    headers['content-length'] = String(Buffer.byteLength(body));
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers, rejectUnauthorized: false }, res => {
      let data = '';
      res.on('data', (chunk: Buffer) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} ${method} ${url}: ${data.slice(0, 300)}`));
          return;
        }
        try {
          resolve(data ? (JSON.parse(data) as T) : (null as T));
        } catch (e) {
          reject(new Error(`Failed to parse response from ${url}: ${e instanceof Error ? e.message : String(e)}`));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error(`Request to ${url} timed out`)));
    req.setTimeout(10_000);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Parses the Keycloak base URL and realm name from a token URL of the form
 * `https://<host>/realms/<realm>/protocol/openid-connect/token`.
 */
function parseKeycloakTokenUrl(tokenUrl: string): { baseUrl: string; realm: string } {
  const match = tokenUrl.match(/^(https?:\/\/.+?)\/realms\/([^/]+)\//);
  if (!match) {
    throw new Error(`Cannot parse Keycloak base URL from: ${tokenUrl}`);
  }
  return { baseUrl: match[1], realm: match[2] };
}

/**
 * Fetches a short-lived Keycloak admin token from the master realm using the
 * `admin-cli` client and the provided credentials.
 */
async function getKeycloakAdminToken(baseUrl: string, adminUser: string, adminPass: string): Promise<string> {
  const body =
    `client_id=admin-cli&grant_type=password` +
    `&username=${encodeURIComponent(adminUser)}&password=${encodeURIComponent(adminPass)}`;
  const resp = await kcFetch<{ access_token: string }>(
    `${baseUrl}/realms/master/protocol/openid-connect/token`,
    'POST',
    null,
    body,
    'application/x-www-form-urlencoded'
  );
  return resp.access_token;
}

/**
 * Registers `http://localhost:<AUTH_PORT>/oauth2/callback` as a valid redirect
 * URI on the `cost-management-ui` Keycloak client. Reads admin credentials from
 * the `keycloak-initial-admin` secret. Sets `kcAdminCtx` and `kcRedirectUriAdded`
 * so `cleanup()` can reverse the change. No-op if the URI is already registered.
 */
async function registerLocalRedirectUri(clientId: string): Promise<void> {
  log.step('Registering localhost redirect URI with Keycloak');

  const tokenUrl = process.env.KEYCLOAK_TOKEN_URL ?? '';
  if (!tokenUrl) {
    log.fail('KEYCLOAK_TOKEN_URL is not set — cannot register redirect URI');
  }

  const { baseUrl, realm } = parseKeycloakTokenUrl(tokenUrl);

  const adminUser = await readSecretField('keycloak-initial-admin', KC_NS, 'username');
  const adminPass = await readSecretField('keycloak-initial-admin', KC_NS, 'password');
  if (!adminUser || !adminPass) {
    log.fail('could not read keycloak-initial-admin credentials from namespace ' + KC_NS);
  }

  const adminToken = await getKeycloakAdminToken(baseUrl, adminUser, adminPass);

  const clients = await kcFetch<KcClient[]>(
    `${baseUrl}/admin/realms/${realm}/clients?clientId=${encodeURIComponent(clientId)}`,
    'GET',
    adminToken
  );
  if (!clients || !clients.length) {
    log.fail(`Keycloak client '${clientId}' not found in realm '${realm}'`);
  }

  const client = clients[0];
  kcAdminCtx = { baseUrl, realm, adminUser, adminPass, clientUuid: client.id };

  if ((client.redirectUris ?? []).includes(LOCAL_REDIRECT_URI)) {
    log.info('redirect URI already registered — no change needed');
    return;
  }

  await kcFetch(
    `${baseUrl}/admin/realms/${realm}/clients/${client.id}`,
    'PUT',
    adminToken,
    JSON.stringify({ ...client, redirectUris: [...(client.redirectUris ?? []), LOCAL_REDIRECT_URI] })
  );
  kcRedirectUriAdded = true;
  log.info(`added ${LOCAL_REDIRECT_URI}`);
}

/**
 * Reverses `registerLocalRedirectUri` — removes the localhost callback URI from
 * the Keycloak client. Re-authenticates with fresh admin credentials because
 * the original token will have expired by the time cleanup runs.
 */
async function unregisterLocalRedirectUri(): Promise<void> {
  if (!kcAdminCtx || !kcRedirectUriAdded) {
    return;
  }
  const { baseUrl, realm, adminUser, adminPass, clientUuid } = kcAdminCtx;

  const adminToken = await getKeycloakAdminToken(baseUrl, adminUser, adminPass);

  const client = await kcFetch<KcClient>(`${baseUrl}/admin/realms/${realm}/clients/${clientUuid}`, 'GET', adminToken);
  if (!client || !client.redirectUris) {
    return;
  }

  const updated = client.redirectUris.filter(u => u !== LOCAL_REDIRECT_URI);
  if (updated.length === client.redirectUris.length) {
    return;
  } // already gone

  await kcFetch(
    `${baseUrl}/admin/realms/${realm}/clients/${clientUuid}`,
    'PUT',
    adminToken,
    JSON.stringify({ ...client, redirectUris: updated })
  );
  log.dim('localhost redirect URI removed from Keycloak client');
}

/**
 * Reads the oauth2-proxy image and startup args from the live `cost-onprem-ui`
 * Deployment on the cluster (single source of truth). Strips cluster-specific
 * flags (TLS, upstream URL, redirect URL, etc.) and replaces them with local
 * equivalents pointing at the webpack dev server and this machine's ports.
 *
 * @param upstreamHost - Hostname the container runtime uses to reach the host
 *   machine (e.g. `host.containers.internal` for Podman).
 */
async function assembleProxyArgs(upstreamHost: string): Promise<ProxyConfig> {
  log.step('Reading oauth2-proxy configuration from cluster Deployment');

  const sel = '{.spec.template.spec.containers[?(@.name=="oauth-proxy")]';
  const imageJsonpath = `jsonpath=${sel}.image}`;
  const argsJsonpath = `jsonpath=${sel}.args}`;

  const image = (await shell`oc get deployment cost-onprem-ui -n ${COST_NS} -o ${imageJsonpath}`).trim();
  if (!image) {
    log.fail(`could not read oauth-proxy image from cost-onprem-ui in ${COST_NS}`);
  }

  const argsJson = (await shell`oc get deployment cost-onprem-ui -n ${COST_NS} -o ${argsJsonpath}`).trim();
  if (!argsJson) {
    log.fail(`could not read oauth-proxy args from cost-onprem-ui in ${COST_NS}`);
  }

  // Strip cluster-specific flags; re-add with local overrides below
  const STRIP = [
    '--https-address',
    '--tls-cert-file',
    '--tls-key-file',
    '--upstream',
    '--redirect-url',
    '--cookie-secure',
    '--backend-logout-url',
    '--pass-host-header',
    '--provider-ca-file',
  ];

  const args = [
    ...(JSON.parse(argsJson) as string[]).filter(a => !STRIP.some(p => a === p || a.startsWith(`${p}=`))),
    `--http-address=0.0.0.0:${AUTH_PORT}`,
    `--upstream=http://${upstreamHost}:${UI_PORT}`,
    `--redirect-url=${LOCAL_REDIRECT_URI}`,
    '--cookie-secure=false',
    '--provider-ca-file=/etc/keycloak-ca.crt',
  ];

  log.info(`image:    ${image}`);
  log.info(`upstream: http://${upstreamHost}:${UI_PORT}`);
  log.info(`proxy:    http://localhost:${AUTH_PORT}`);
  return { image, args };
}

/**
 * Launches `npm run start:onprem` as a background process with
 * `OAUTH2_PROXY_MODE=true` so webpack skips the `TokenRefresher` middleware
 * and instead reads user identity from headers injected by oauth2-proxy.
 * Polls `http://localhost:<UI_PORT>/` every 2 s (up to 120 s) before returning.
 */
async function startWebpack(): Promise<void> {
  log.step(`Starting webpack dev server on :${UI_PORT} (OAUTH2_PROXY_MODE=true)`);

  const env = { ...process.env, OAUTH2_PROXY_MODE: 'true' };
  webpackChild = background('npm', ['run', 'start:onprem'], env);

  webpackChild.on('close', (code: number | null) => {
    if (!cleaningUp && code !== null && code !== 0) {
      log.warn(`webpack exited unexpectedly (code ${code})`);
      cleanup().then(() => process.exit(1));
    }
  });

  log.dim('Waiting for webpack to be ready...');
  for (let i = 0; i < 60; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`http://localhost:${UI_PORT}/`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status < 500) {
        log.info(`ready after ${i * 2}s`);
        return;
      }
    } catch {
      // not ready yet — keep polling
    }
    await sleep(2000);
  }
  log.fail('webpack did not become ready within 120s');
}

/**
 * Runs the oauth2-proxy container in the foreground (blocking until it exits
 * or is stopped). Credentials are passed as bare `-e KEY` flags so that the
 * actual values — set on `process.env` — never appear in `ps aux` output.
 * Force-removes any container left over from a previous crashed run before
 * starting (only when one is actually found, with a visible warning), so stale
 * containers never block a restart.
 *
 * @param runtime    - Full path to the container runtime binary.
 * @param image      - OCI image reference for oauth2-proxy.
 * @param args       - Assembled oauth2-proxy CLI flags.
 * @param extraFlags - Runtime-specific `run` flags (e.g. `--add-host` for Docker on Linux).
 */
async function startProxyContainer(
  runtime: string,
  image: string,
  args: string[],
  extraFlags: string[]
): Promise<void> {
  log.step(`Starting oauth2-proxy container on :${AUTH_PORT}`);
  log.dim(`Open: http://localhost:${AUTH_PORT}`);

  // Secrets are inherited via process.env; bare -e KEY flags (no value in CLI)
  // prevent secrets from appearing in `ps aux` output
  const containerArgs = [
    'run',
    '--rm',
    '--name',
    'cost-onprem-oauth2-proxy',
    '-p',
    `${AUTH_PORT}:${AUTH_PORT}`,
    '-v',
    `${kcCaCertFile}:/etc/keycloak-ca.crt:ro`,
    '-e',
    'OAUTH2_PROXY_CLIENT_ID',
    '-e',
    'OAUTH2_PROXY_CLIENT_SECRET',
    '-e',
    'OAUTH2_PROXY_COOKIE_SECRET',
    ...extraFlags,
    image,
    ...args,
  ];

  // Only remove a stale container if one actually exists (running or stopped).
  // This gives a visible warning when a crashed run left one behind.
  const stale = (await shell`${runtime} ps -a --filter name=cost-onprem-oauth2-proxy --format {{.Names}}`).trim();
  if (stale) {
    log.warn('Found stale container from a previous run — removing it');
    await stream(runtime, ['rm', '-f', 'cost-onprem-oauth2-proxy'], { nothrow: true }).catch(() => {});
  }

  const exitCode = await stream(runtime, containerArgs, { nothrow: true });
  if (exitCode !== 0 && !cleaningUp) {
    throw new Error(`oauth2-proxy container failed to start (exit code ${exitCode})`);
  }
}

/**
 * Idempotent teardown — safe to call multiple times via signal handlers and
 * the `finally` block. Sends SIGTERM to webpack, gracefully stops the proxy
 * container (SIGTERM → SIGKILL after 10 s; `--rm` handles removal), and
 * removes the temporary CA cert file.
 */
async function cleanup(): Promise<void> {
  if (cleaningUp) {
    return;
  }
  cleaningUp = true;
  process.stdout.write('\n');
  log.step('Shutting down...');
  if (webpackChild) {
    webpackChild.kill('SIGTERM');
  }
  if (kcAdminCtx && kcRedirectUriAdded) {
    await unregisterLocalRedirectUri().catch(e =>
      log.warn(`could not remove localhost redirect URI: ${e instanceof Error ? e.message : String(e)}`)
    );
  }
  if (containerRuntime) {
    // `--rm` on the container means it is removed automatically when it exits,
    // so `stop` (SIGTERM → SIGKILL) is all that is needed.
    // Race against a 15s wall-clock timeout so a broken runtime can't block cleanup forever.
    await Promise.race([
      stream(containerRuntime, ['stop', '--time', '10', 'cost-onprem-oauth2-proxy'], { nothrow: true }).catch(() => {}),
      sleep(15_000),
    ]);
  }
  if (kcCaCertFile) {
    await rm(kcCaCertFile, { force: true });
  }
  log.dim('Done.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  try {
    const { runtime, upstreamHost, extraFlags } = await detectContainerRuntime();
    containerRuntime = runtime;

    validateClusterEnv();

    const { clientId, clientSecret } = await readUiClientCredentials();

    kcCaCertFile = await fetchKeycloakCaCert();

    await registerLocalRedirectUri(clientId);

    const cookieSecret = generateCookieSecret();

    const { image, args } = await assembleProxyArgs(upstreamHost);

    // Set secrets on process.env — inherited by the container runtime subprocess.
    // Combined with bare -e KEY flags (no value in CLI), they stay out of ps output.
    process.env.OAUTH2_PROXY_CLIENT_ID = clientId;
    process.env.OAUTH2_PROXY_CLIENT_SECRET = clientSecret;
    process.env.OAUTH2_PROXY_COOKIE_SECRET = cookieSecret;

    process.stdout.write('\n');
    await startWebpack();

    process.stdout.write('\n');
    await startProxyContainer(runtime, image, args, extraFlags);
  } finally {
    await cleanup();
  }
}

if (isMain) {
  main().catch(e => {
    process.stderr.write(`${C.bold}${C.red}✖ Error: ${e instanceof Error ? e.message : String(e)}${C.reset}\n`);
    process.exit(1);
  });
}
