export const enum ConfigType {
  current = 'current',
  recommended = 'recommended',
}

export const enum Interval {
  short_term = 'short_term', // last 24 hrs
  medium_term = 'medium_term', // last 7 days
  long_term = 'long_term', // last 15 days
}

export const enum EngineType {
  config = 'config',
  variation = 'variation',
}

export const enum OptimizationType {
  cost = 'cost',
  performance = 'performance',
}

export const enum RecommendationType {
  cpu = 'cpu',
  memory = 'memory',
}

export const enum ResourceType {
  limits = 'limits',
  requests = 'requests',
}

export const enum UsageType {
  cpuUsage = 'cpuUsage',
  memoryUsage = 'memoryUsage',
}
