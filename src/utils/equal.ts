export function isEqual(obj1, obj2): boolean {
  let a = JSON.stringify(obj1);
  let b = JSON.stringify(obj2);
  if (!a) {
    a = '';
  }
  if (!b) {
    b = '';
  }
  return a.split('').sort().join('') === b.split('').sort().join('');
}
