import React from 'react';
import { Wallet } from 'components';
import { Link, Routes, Route } from 'react-router-dom';
import { MintToken, SendSol } from 'pages';

function App() {
  return (
    <Wallet>
      <nav>
        <Link to="mint-token">Mint token</Link>
        <Link to="send-sol">Send sol</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="mint-token" element={<MintToken />} />
        <Route path="send-sol" element={<SendSol />} />
      </Routes>
    </Wallet>
  );
}

export default App;
