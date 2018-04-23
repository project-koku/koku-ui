import * as React from 'react';

declare module 'react' {
  // Context via RenderProps
  export interface ProviderProps<T> {
    value: T;
    children?: ReactNode;
  }

  export interface ConsumerProps<T> {
    children: (value: T) => ReactNode;
    unstable_observedBits?: number;
  }

  export type Provider<T> = React.ComponentType<ProviderProps<T>>;
  export type Consumer<T> = React.ComponentType<ConsumerProps<T>>;
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
  }
  export function createContext<T>(
    defaultValue: T,
    calculateChangedBits?: (prev: T, next: T) => number
  ): Context<T>;
  export function createContext<T>(): Context<T | undefined>;
}
