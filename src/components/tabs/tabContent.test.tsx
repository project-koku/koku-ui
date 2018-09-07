import { shallow } from 'enzyme';
import React from 'react';
import { TabContent, TabContentProps } from './tabContent';

const props: TabContentProps = {
  data: {
    id: 1,
    label: '2',
    content: '2',
  },
};

test('tab content props string render', () => {
  expect(shallow(<TabContent {...props} />).text()).toBe('2');
});

test('content props function render', () => {
  const content = data => <div>{`${data.id}-${data.label}`}</div>;
  expect(
    shallow(
      <TabContent data={Object.assign({}, props.data, { content })} />
    ).text()
  ).toBe('1-2');
});
