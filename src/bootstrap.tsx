import React from 'react';
import { render } from 'react-dom';

import FederatedEntry from './federatedEntry';

const root = document.getElementById('root');
render(<FederatedEntry />, root, () => root.setAttribute('data-ouia-safe', 'true'));
