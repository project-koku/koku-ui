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
