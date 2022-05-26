import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  Account,
  createSetAuthorityInstruction,
  AuthorityType,
} from '@solana/spl-token';
import { Button } from '@mui/material';
import React from 'react';

export const MintNft = () => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  let fromTokenAccount: Account;
  let mint: PublicKey;

  const createNft = async () => {
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);

    // Create new NFT mint
    mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      0, // only allow whole tokens
    );

    console.log(`Create NFT: ${mint.toBase58()}`);

    // Get the NFT account of the fromWallet address, and if it does not exist, create it
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey,
    );

    console.log(`Create NFT Account: ${fromTokenAccount.address.toBase58()}`);
  };
  const mintNft = async () => {
    // Mint 1 new token to the "fromTokenAccount" account we just created
    const signature = await mintTo(
      connection,
      fromWallet,
      mint,
      fromTokenAccount.address,
      fromWallet.publicKey,
      1,
    );
    console.log(`Mint signature: ${signature}`);
  };
  const lockNft = async () => {
    // Create our transaction to change minting permissions
    const transaction = new Transaction().add(createSetAuthorityInstruction(
      mint,
      fromWallet.publicKey,
      AuthorityType.MintTokens,
      null,
    ));

    // Send transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Lock signature: ${signature}`);
  };

  return (
    <div>
      <h1 className="mb-2">Mint Nft Section</h1>
      <div className="flex gap-2">
        <Button variant="contained" onClick={createNft}>Create NFT</Button>
        <Button variant="contained" onClick={mintNft}>Mint NFT</Button>
        <Button variant="contained" onClick={lockNft}>Lock NFT</Button>
      </div>
    </div>
  );
};
