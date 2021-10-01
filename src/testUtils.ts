import { ReactWrapper, ShallowWrapper } from 'enzyme';
import { testIdProp } from 'testIds';

export function findByTestId(view: ShallowWrapper | ReactWrapper, testId: string) {
  return (view as ShallowWrapper).findWhere(node => node.prop(testIdProp) === testId).first();
}
export function mockDate(day: number = 1) {
  const constantDate = new Date(2018, 0, day, 0);
  (global as any).Date = class extends Date {
    constructor(dateString: string) {
      super(dateString);
      if (!dateString) {
        return constantDate;
      }
    }
  };
}
