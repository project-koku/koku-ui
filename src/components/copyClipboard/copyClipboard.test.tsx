import { OkIcon, PasteIcon } from '@patternfly/react-icons';
import { shallow } from 'enzyme';
import React from 'react';
import { CopyClipboard, CopyClipboardStateless } from './copyClipboard';

test('copy clipboard matches snapshot', () => {
  expect(
    shallow(
      <CopyClipboardStateless
        text="this is text to copy"
        onCopy={jest.fn}
        isCopied={false}
        aria-label="copy me"
      />
    )
  ).toMatchSnapshot();
});

test('copy clipboard different icon on isCopied', () => {
  let view = shallow(
    <CopyClipboardStateless
      text=""
      onCopy={jest.fn}
      isCopied={false}
      aria-label="copy text"
    />
  );
  expect(view.find(PasteIcon).length).toBe(1);
  expect(view.find(OkIcon).length).toBe(0);

  view = shallow(
    <CopyClipboardStateless
      text=""
      onCopy={jest.fn}
      isCopied
      aria-label="copy text test"
    />
  );
  expect(view.find(PasteIcon).length).toBe(0);
  expect(view.find(OkIcon).length).toBe(1);
});
