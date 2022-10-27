import React from 'react';
import { render } from 'react-dom';

import AppEntry from './appEntry';

const root = document.getElementById('root');
render(<AppEntry />, root, () => root.setAttribute('data-ouia-safe', 'true'));
