import React from 'react';
import { Wallet } from 'components';
import { Link, Routes, Route } from 'react-router-dom';
import { MintToken, SendSol, MintNft } from 'pages';

function App() {
  return (
    <Wallet>
      <nav>
        <Link to="mint-token">Mint token</Link>
        <Link to="send-sol">Send sol</Link>
        <Link to="mint-nft">Mint NFT</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="mint-token" element={<MintToken />} />
        <Route path="send-sol" element={<SendSol />} />
        <Route path="mint-nft" element={<MintNft />} />
      </Routes>
    </Wallet>
  );
}

export default App;
