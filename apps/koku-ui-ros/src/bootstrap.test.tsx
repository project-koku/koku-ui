jest.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: jest.fn(),
  }),
}));

jest.mock('./appEntry', () => () => null);

test('bootstraps the app onto the app element', () => {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);
  require('./bootstrap');
  expect(container.getAttribute('data-ouia-safe')).toBe('true');
});
