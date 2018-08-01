import { ReactWrapper, ShallowWrapper } from 'enzyme';
import { testIdProp } from 'testIds';

export function wait() {
  return new Promise(resolve => setImmediate(resolve));
}

export function findByTestId(
  view: ShallowWrapper | ReactWrapper,
  testId: string
) {
  return (view as ShallowWrapper)
    .findWhere(node => node.prop(testIdProp) === testId)
    .first();
}

export function mockDate() {
  const constantDate = new Date('2018');
  (global as any).Date = class extends Date {
    constructor() {
      super();
      return constantDate;
    }
  };
}
