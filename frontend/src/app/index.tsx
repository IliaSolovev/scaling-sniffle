import React from 'react';

import { Routing } from 'pages';
import { Header } from 'widgets';
import { Wallet } from './providers/wallet';

export const App = () => (
  <Wallet>
    <Header />
    <Routing />
  </Wallet>
);
