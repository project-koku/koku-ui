# Auth-enabled dev mode (`start:onprem:auth`)

> **TL;DR** — run `npm run start:onprem:auth`, open `http://localhost:9002`, and you get a real Keycloak login screen instead of a pre-authenticated session.

---

## Why does this mode exist?

The default dev server (`start:onprem:dev`) is optimised for **speed**. It bypasses the login screen entirely: a background process silently fetches an API token using a service account and injects it into every outgoing request. This is great for everyday development, but it makes it impossible to:

- See what the login page actually looks like to a real user.
- Test what happens when a session expires and the user is redirected to log in again.
- Verify the logout flow (`/logout` → Keycloak sign-out → back to the login page).

`start:onprem:auth` adds a thin authentication layer in front of the dev server that mirrors exactly what happens in production.

---

## What is oauth2-proxy?

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) is a small reverse-proxy that handles the OAuth 2.0 / OIDC dance on behalf of your application. In production, it runs as a sidecar container next to the UI nginx container. Your browser never talks to the UI directly — it always goes through oauth2-proxy first.

When you are not logged in, oauth2-proxy redirects your browser to Keycloak. After you log in, Keycloak sends an authorisation code back to oauth2-proxy, which exchanges it for tokens, sets an encrypted session cookie, and forwards your request to the real app — with an `Authorization: Bearer <token>` header already attached.

---

## How the two modes compare

| | `start:onprem:dev` | `start:onprem:auth` |
|---|---|---|
| **Login screen** | ✗ skipped | ✔ real Keycloak page |
| **Session / logout** | ✗ token never expires | ✔ real session, real logout |
| **Port** | 9001 | 9002 |
| **Auth mechanism** | `TokenRefresher` (service account) | oauth2-proxy (OIDC PKCE) |
| **Extra prerequisite** | — | Podman or Docker |

---

## How it works, step by step

```
Your browser  ──────────────────────►  oauth2-proxy  (localhost:9002)
                                             │
                                  Not logged in?
                                             │
                                             ▼
                                         Keycloak  (on-cluster)
                                             │
                              You enter your username & password
                                             │
                                             ▼
                               Keycloak issues an auth code
                                             │
                                             ▼
                                  oauth2-proxy exchanges the
                                  code for an access token,
                                  sets an encrypted cookie
                                             │
                                             ▼
                oauth2-proxy forwards your request to webpack-dev-server
                (localhost:9001) with  Authorization: Bearer <token>
                                             │
                                             ▼
                          webpack-dev-server proxies API calls to
                          the Envoy gateway on the cluster
```

### 1. You open `http://localhost:9002`

Your browser hits the `oauth2-proxy` container running on your machine. If you are not logged in, it immediately redirects you to the Keycloak login page hosted on the cluster.

### 2. You log in to Keycloak

This is the same Keycloak instance that the cluster uses for real users. You enter your credentials exactly as a real user would.

### 3. Keycloak redirects back to `oauth2-proxy`

After a successful login, Keycloak sends your browser to `http://localhost:9002/oauth2/callback` with a short-lived authorisation code. `oauth2-proxy` exchanges this code for an access token (this is the **PKCE** flow — the code cannot be replayed even if intercepted).

### 4. `oauth2-proxy` sets a session cookie and forwards the request

`oauth2-proxy` stores your tokens in an encrypted session cookie and forwards your original request to the webpack dev server on `localhost:9001`, adding the `Authorization: Bearer <token>` header.

### 5. webpack proxies API calls to the cluster

webpack-dev-server is running in `OAUTH2_PROXY_MODE=true`. In this mode:
- It does **not** start `TokenRefresher` (no background token fetching — `oauth2-proxy` handles that).
- Its `/api/me` endpoint reads the `x-auth-request-preferred-username` and `x-forwarded-email` headers that `oauth2-proxy` injects, so the app shows your real username.
- Its `/logout` endpoint redirects to `/oauth2/sign_out`, which tells `oauth2-proxy` to clear your session and send you back to the Keycloak logout page.

### 6. Token refresh and logout

`oauth2-proxy` silently refreshes your access token in the background (every ~4 minutes, matching the cluster configuration). When the token can no longer be refreshed — or when you click **Log out** — `oauth2-proxy` clears the session cookie and redirects you back to the Keycloak login page.

---

## Configuration the script reads from the cluster

To ensure the local `oauth2-proxy` container behaves identically to the one running in production, `start-onprem-auth.mts` reads its configuration **directly from the cluster** at startup:

| What | Where it comes from |
|---|---|
| `oauth2-proxy` image tag | `cost-onprem-ui` Deployment (container `oauth-proxy`) |
| `oauth2-proxy` flags (`--provider`, `--oidc-issuer-url`, etc.) | Same Deployment's `args` list |
| `cost-management-ui` client ID & secret | Secret `keycloak-client-secret-cost-management-ui` in the `keycloak` namespace |
| Keycloak CA certificate | Secret `keycloak-ca-cert` in the `cost-onprem` namespace |
| Cookie secret | Generated fresh each run (32 random bytes) |

A few cluster-only flags are stripped (TLS cert paths, HTTPS address) and replaced with local equivalents (plain HTTP on `:9002`, upstream pointing to `localhost:9001`).

---

## Startup sequence

When you run `npm run start:onprem:auth`:

1. **`setup-onprem-env.sh`** runs first (same as `start:onprem:dev`) — it logs you into the cluster and sets `API_PROXY_URL`.
2. **`start-onprem-auth.mts`** takes over:
   - Detects your container runtime (`CONTAINER_RUNTIME` env var if set, otherwise Podman → Docker via PATH).
   - Reads credentials and the CA certificate from the cluster.
   - Starts **webpack** on `:9001` in the background with `OAUTH2_PROXY_MODE=true`.
   - Polls `http://localhost:9001/` until webpack is ready.
   - Starts the **`oauth2-proxy` container** on `:9002` in the foreground.
3. When you press **Ctrl-C**: the container stops, webpack is killed, and the temporary CA cert file is deleted automatically.

---

## Environment overrides

```bash
# Change ports
ONPREM_AUTH_PORT=9002 ONPREM_UI_PORT=9001 npm run start:onprem:auth

# Use a non-default podman or docker binary path
CONTAINER_RUNTIME=/opt/podman/bin/podman npm run start:onprem:auth

# Override cluster namespaces
COST_NAMESPACE=my-cost KEYCLOAK_NAMESPACE=my-keycloak npm run start:onprem:auth
```

---

## Troubleshooting

**"no container runtime found"** — install [Podman](https://podman.io/docs/installation) or [Docker Desktop](https://docs.docker.com/get-started/get-docker/). If either is installed at a non-standard path, set `CONTAINER_RUNTIME=/path/to/podman` (or `docker`).

**"API_PROXY_URL is not set"** — you ran `node scripts/start-onprem-auth.mts` directly. Always use `npm run start:onprem:auth`, which sources `setup-onprem-env.sh` first.

**"could not read oauth-proxy image from cost-onprem-ui"** — the `cost-onprem` Helm chart is not deployed on the cluster, or you are not logged in (`oc whoami` to check).

**Keycloak shows "invalid redirect URI"** — the `cost-management-ui` Keycloak client on the cluster may not have `http://localhost:9002/oauth2/callback` in its allowed redirect URIs. Ask your cluster admin to add it, or open the Keycloak admin console and add it yourself.

**Browser shows a blank page after login** — webpack may still be starting up. Wait a few seconds and reload.
