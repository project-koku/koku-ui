import glamorous, {
  CSSProperties,
  GlamorousOptions,
  HTMLKey,
  StyleArgument,
  SVGKey
} from 'glamorous';
import React from 'react';

type ComponentType<P> = HTMLKey | SVGKey | React.ComponentType<P>;

export function styled<P = {}>(
  component: ComponentType<P>,
  styles: StyleArgument<CSSProperties, P> = {},
  options: Partial<GlamorousOptions<P, any, any>> = {}
) {
  return glamorous<P>(component as any, options)(styles);
}
