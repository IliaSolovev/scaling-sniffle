import React from 'react';
import {
  Transaction,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAccount,
  getAssociatedTokenAddress,
  NATIVE_MINT,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  transfer,
  getOrCreateAssociatedTokenAccount,
  closeAccount,
} from '@solana/spl-token';
import { networkStore } from 'stores';
import { Button } from '@mui/material';

export const SendSol = () => {
  const connection = networkStore((state) => state.connection);
  const fromWallet = Keypair.generate();
  let associatedTokenAccount: PublicKey;

  const wrapSol = async () => {
    const airdropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      2 * LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);
    associatedTokenAccount = await getAssociatedTokenAddress(
      NATIVE_MINT,
      fromWallet.publicKey,
    );

    // Create token account to hold your wrapped SOL
    const ataTransaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        fromWallet.publicKey,
        associatedTokenAccount,
        fromWallet.publicKey,
        NATIVE_MINT,
      ),
    );

    await sendAndConfirmTransaction(connection, ataTransaction, [fromWallet]);

    // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
    const solTransferTransaction = new Transaction()
      .add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: associatedTokenAccount,
          lamports: LAMPORTS_PER_SOL, // the SOL that we're sending over
        }),
        createSyncNativeInstruction(
          associatedTokenAccount,
        ),
      );

    await sendAndConfirmTransaction(connection, solTransferTransaction, [fromWallet]);
    const accountInfo = await getAccount(connection, associatedTokenAccount);
    console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);
  };

  const unwrapSol = async () => {
    const walletBalance = await connection.getBalance(fromWallet.publicKey);
    console.log(`Balance before unwrapping WSOL: ${walletBalance}`);
    await closeAccount(
      connection,
      fromWallet,
      associatedTokenAccount,
      fromWallet.publicKey,
      fromWallet,
    );
    const walletBalancePostClose = await connection.getBalance(fromWallet.publicKey);
    console.log(`Balance after unwrapping WSOL: ${walletBalancePostClose}`);
  };

  const sendSol = async () => {
    // airdrop SOL to send
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);

    // Wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = new PublicKey('Hda8gwvKp2sspGsen6aotGUAEHivmu94a52gtqowxHHW');

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      NATIVE_MINT,
      fromWallet.publicKey,
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, NATIVE_MINT, toWallet);

    // Transfer the new token to the "toTokenAccount" we just created
    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      LAMPORTS_PER_SOL,
    );
    console.log('Transfer tx:', signature);
  };

  return (
    <div>
      <h1 className="mb-2">Send Sol Section</h1>
      <div className="flex gap-2">
        <Button variant="contained" onClick={wrapSol}>Wrap SOL</Button>
        <Button variant="contained" onClick={unwrapSol}>Unwrap SOL</Button>
        <Button variant="contained" onClick={sendSol}>Send SOL</Button>
      </div>
    </div>
  );
};
