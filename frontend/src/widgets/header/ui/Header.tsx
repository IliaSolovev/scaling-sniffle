import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar, Button,
} from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Header = () => (
  <AppBar position="sticky" color="default">
    <div className="flex justify-between items-center px-2 py-1">
      <div className="space-x-2">
        <Button variant="text" component={Link} to="mint-token">Mint token</Button>
        <Button variant="text" component={Link} to="send-sol">Send sol</Button>
        <Button variant="text" component={Link} to="mint-nft">Mint NFT</Button>
        <Button variant="text" component={Link} to="mint-metaplex-nft">Mint Metaplex NFT</Button>
      </div>
      <WalletMultiButton />
    </div>
  </AppBar>
);
