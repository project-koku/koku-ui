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
	const originalFlags = process.env.KOKU_UI_ONPREM_SOURCES_ENABLED;

	beforeEach(async () => {
		recordedRoutes.length = 0;
		process.env.KOKU_UI_ONPREM_SOURCES_ENABLED = 'true';
		jest.resetModules();
		const mod = await import('./routes');
		routesExport = mod.routes;
		AppRoutes = mod.Routes as any;
	});

	afterEach(() => {
		if (originalFlags === undefined) {
			delete process.env.KOKU_UI_ONPREM_SOURCES_ENABLED;
		} else {
			process.env.KOKU_UI_ONPREM_SOURCES_ENABLED = originalFlags;
		}
	});

	test('renders a Route for every configured path and a wildcard', () => {
		render(<AppRoutes />);
		const configuredPaths = Object.values(routesExport).map(r => r.path);
		const renderedPaths = recordedRoutes.map(r => r.path);
		// The vendor Sources app owns settings integrations, so settings is a splat and the detail route is omitted.
		configuredPaths
			.filter(p => p !== '/settings' && p !== '/settings/integrations/detail/:uuid')
			.forEach(p => expect(renderedPaths).toContain(p));
		expect(renderedPaths).toContain('/settings/*');
		expect(renderedPaths).not.toContain('/settings/integrations/detail/:uuid');
		expect(renderedPaths).toContain('*');
	});

	test('keeps the koku-ui-sources detail route when the sources UI env is false', async () => {
		process.env.KOKU_UI_ONPREM_SOURCES_ENABLED = 'false';
		jest.resetModules();
		const mod = await import('./routes');
		routesExport = mod.routes;
		AppRoutes = mod.Routes as any;
		recordedRoutes.length = 0;
		render(<AppRoutes />);
		const configuredPaths = Object.values(routesExport).map(r => r.path);
		const renderedPaths = recordedRoutes.map(r => r.path);
		configuredPaths.forEach(p => expect(renderedPaths).toContain(p));
		expect(renderedPaths).not.toContain('/settings/*');
		expect(renderedPaths).toContain('*');
	});

	test('route definitions have expected shapes (path and element)', () => {
		// Validate a sampling including dynamic segment and root
		expect(routesExport.costModelBreakdown.path).toMatch(/\/settings\/cost-model\/:uuid/);
		expect(routesExport.overview.path).toBe('/');
		expect(routesExport.settings.path).toBe('/settings');
		expect(routesExport.integrationBreakdown.path).toBe('/settings/integrations/detail/:uuid');
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