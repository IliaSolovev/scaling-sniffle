import create from 'zustand';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const getNetwork = (): WalletAdapterNetwork => {
  if (process.env.NODE_ENV === 'development') {
    return (process.env.NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
  }
  return WalletAdapterNetwork.Mainnet;
};

const network = getNetwork();

export const networkStore = create(() => ({
  network,
  connection: new Connection(clusterApiUrl(network), 'confirmed'),
}));
