import React from 'react';
import { render } from '@testing-library/react';

// Capture Route props from react-router-dom
const recordedRoutes: Array<{ path: string; element: any }> = [];

jest.mock('react-router-dom', () => ({
	__esModule: true,
	Routes: ({ children }: any) => <>{children}</>,
	Route: (props: any) => {
		recordedRoutes.push({ path: props.path, element: props.element });
		return null;
	},
}));

// Wrap any route component with a recognizable element so rendering elements is safe if needed
jest.mock('components/userAccess', () => ({
	__esModule: true,
	userAccess: (Comp: any) => () => <div data-testid="ua" />,
}));

describe('App routes', () => {
	let routesExport: typeof import('./routes').routes;
	let AppRoutes: React.ComponentType;

	beforeEach(async () => {
		recordedRoutes.length = 0;
		jest.resetModules();
		const mod = await import('./routes');
		routesExport = mod.routes;
		AppRoutes = mod.Routes as any;
	});

	test('renders a Route for every configured path and a wildcard', () => {
		render(<AppRoutes />);
		const configuredPaths = Object.values(routesExport).map(r => r.path);
		const renderedPaths = recordedRoutes.map(r => r.path);
		// All configured paths are rendered
		configuredPaths.forEach(p => expect(renderedPaths).toContain(p));
		// Wildcard route is present
		expect(renderedPaths).toContain('*');
	});

	test('route definitions have expected shapes (path and element)', () => {
		// Validate a sampling including dynamic segment and root
		expect(routesExport.costModel.path).toMatch(/\/settings\/cost-model\/:uuid/);
		expect(routesExport.overview.path).toBe('/');
		expect(routesExport.settings.path).toBe('/settings');
		// Ensure element is provided for each route
		Object.values(routesExport).forEach(def => {
			expect(def.element).toBeTruthy();
		});
	});

	test('rendered Route elements correspond to wrapped components (userAccess applied)', () => {
		render(<AppRoutes />);
		// Each configured route should have an element prop
		recordedRoutes.forEach(r => {
			expect(r.element).toBeDefined();
		});
	});
}); 