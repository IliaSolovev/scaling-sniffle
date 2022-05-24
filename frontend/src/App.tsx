import React from 'react';
import { Wallet } from 'components';
import { Link, Routes, Route } from 'react-router-dom';
import { MintToken } from 'pages';

function App() {
  return (
    <Wallet>
      <nav>
        <Link to="mint-token">MintToken</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="mint-token" element={<MintToken />} />
      </Routes>
    </Wallet>
  );
}

export default App;
