import React from 'react';
import { createRoot } from 'react-dom/client';

import AppEntry from './appEntry';

// const root = document.getElementById('root');
// ReactDOM.render(<AppEntry />, root, () => root?.setAttribute('data-ouia-safe', 'true'));

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<AppEntry />);
container?.setAttribute('data-ouia-safe', 'true');
