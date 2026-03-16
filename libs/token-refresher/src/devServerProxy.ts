import type WebpackDevServer from 'webpack-dev-server';

import type { TokenRefresher } from './TokenRefresher';

export interface DevServerProxyOptions {
  context: string | string[];
  target: string;
  pathRewrite?: Record<string, string>;
  changeOrigin?: boolean;
  secure?: boolean;
}

export function createDevServerProxy(
  refresher: TokenRefresher,
  options: DevServerProxyOptions
): WebpackDevServer.ProxyConfigArrayItem {
  const { context, target, pathRewrite, changeOrigin = true, secure = true } = options;

  return {
    context,
    target,
    changeOrigin,
    secure,
    ...(pathRewrite && { pathRewrite }),
    onProxyReq: proxyReq => {
      const tok = refresher.token;
      if (tok) {
        proxyReq.setHeader('Authorization', `Bearer ${tok}`);
      }
    },
  };
}
