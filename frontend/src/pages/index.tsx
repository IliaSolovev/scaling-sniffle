import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { MintToken } from './mint-token';
import { SendSol } from './send-sol';
import { MintNft } from './mint-nft';
import { MintMetaplexNft } from './mint-metaplex-nft';

export const Routing = () => (
  <Routes>
    <Route path="mint-token" element={<MintToken />} />
    <Route path="send-sol" element={<SendSol />} />
    <Route path="mint-nft" element={<MintNft />} />
    <Route path="mint-metaplex-nft" element={<MintMetaplexNft />} />
    <Route path="*" element={<MintToken />} />
  </Routes>
);
