import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { withRouter } from './router';

const Probe = ({ router }: { router: { location: { pathname: string }; params: { id?: string } } }) => (
  <div>
    <span>{router.location.pathname}</span>
    <span>{router.params.id}</span>
  </div>
);

describe('withRouter', () => {
  test('injects location, navigate, and params', () => {
    const Wrapped = withRouter(Probe);
    render(
      <MemoryRouter initialEntries={['/items/abc']}>
        <Routes>
          <Route path="/items/:id" element={<Wrapped />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('/items/abc')).toBeInTheDocument();
    expect(screen.getByText('abc')).toBeInTheDocument();
  });
});
