import { css, StyleSheet } from 'aphrodite';

const create = StyleSheet.create;
const classNames = (...classes: (string | null | void)[]) => {
  return classes.filter(Boolean).join(' ');
};

export { css, create, classNames };
