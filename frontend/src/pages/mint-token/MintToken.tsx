import React from 'react';
import { Button } from '@mui/material';
import { networkStore } from 'entities';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
  Account,
  createMint, getAccount, getMint,
  getOrCreateAssociatedTokenAccount, mintTo,
  transfer,
} from '@solana/spl-token';

export const MintToken = () => {
  const connection = networkStore((state) => state.connection);
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  // Public Key to your Phantom Wallet
  const toWallet = new PublicKey('Hda8gwvKp2sspGsen6aotGUAEHivmu94a52gtqowxHHW');
  let fromTokenAccount: Account;
  let mint: PublicKey;

  const createToken = async () => {
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);

    // Create new token mint
    mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      9, // 9 here means we have a decmial of 9 0's
    );
    console.log(`Create token: ${mint.toBase58()}`);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey,
    );
    console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
  };
  const checkBalance = async () => {
    // get the supply of tokens we have minted into existance
    const mintInfo = await getMint(connection, mint);
    console.log(mintInfo.supply);

    // get the amount of tokens left in the account
    const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
    console.log(tokenAccountInfo.amount);
  };
  const mintToken = async () => {
    // Mint 1 new token to the "fromTokenAccount" account we just created
    const signature = await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      fromWallet.publicKey,
      10000000000, // 10 billion
    );
    console.log(`Mint signature: ${signature}`);
  };
  const sendToken = async () => {
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
    console.log(`toTokenAccount ${toTokenAccount.address}`);

    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      1000000000, // 1 billion
    );
    console.log(`finished transfer with ${signature}`);
  };

  return (
    <div>
      <h1 className="mb-2">Mint Token Section</h1>
      <div className="flex gap-2">
        <Button variant="contained" onClick={createToken}>Create token</Button>
        <Button variant="contained" onClick={mintToken}>Mint token</Button>
        <Button variant="contained" onClick={checkBalance}>Check balance</Button>
        <Button variant="contained" onClick={sendToken}>Send token</Button>
      </div>
    </div>
  );
};
