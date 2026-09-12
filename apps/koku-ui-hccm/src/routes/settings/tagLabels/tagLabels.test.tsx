import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TagLabels from './tagLabels';

jest.mock('./tags', () => ({
  Tags: () => <div>tags-panel</div>,
}));

jest.mock('./tagMapping/tagMapping', () => ({
  __esModule: true,
  default: () => <div>mapping-panel</div>,
}));

describe('TagLabels', () => {
  test('renders the tags tab by default and switches to mapping', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<TagLabels canWrite />);

    expect(screen.getByText('tags-panel')).toBeInTheDocument();
    expect(screen.queryByText('mapping-panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /map/i }));
    expect(await screen.findByText('mapping-panel')).toBeInTheDocument();
  });
});
