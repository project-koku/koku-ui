export function wait() {
  return new Promise(resolve => setImmediate(resolve));
}
