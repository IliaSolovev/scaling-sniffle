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
  Account,
  MintLayout,
} from '@solana/spl-token';
import React, { useEffect, useState } from 'react';
import {
  Form, FormInstance,
  Input, InputNumber,
  Upload,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { MAX_METADATA_LEN, getAssetCostToStore, LAMPORT_MULTIPLIER } from 'oyster-common';
import { networkStore } from '@/entities';

const { Dragger } = Upload;
export const MintMetaplexNft = () => {
  const [coverArtError, setCoverArtError] = useState<string | null>(null);

  const [form] = useForm();

  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  let fromTokenAccount: Account;
  let mint: PublicKey;

  return (
    <div className="p-3">
      <h1 className="mb-2">Mint Metaplex Nft</h1>
      <div className="w-24 h-24">
        <Dragger
          customRequest={() => {}}
          accept=".png,.jpg,.gif,.mp4,.svg"
          onChange={async (info) => {
            const file = info.file.originFileObj;
            if (!file) {
              return;
            }

            const sizeKB = file.size / 1024;
            if (sizeKB < 25) {
              setCoverArtError(
                `The file ${file.name} is too small. It is ${
                  Math.round(10 * sizeKB) / 10
                }KB but should be at least 25KB.`,
              );
              return;
            }

            form.setFieldsValue({ file });
            setCoverArtError(null);
          }}
        >
          Upload
        </Dragger>
      </div>
      <InfoForm form={form} />
      <Launch form={form} />
    </div>
  );
};

const InfoForm = ({ form }: {form: FormInstance}) => (
  <Form form={form} labelCol={{ span: 2 }}>
    <Form.Item name="title" label="Title">
      <Input />
    </Form.Item>
    <Form.Item name="symbol" label="Symbol">
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input.TextArea />
    </Form.Item>
    <Form.Item name="supply" label="Supply">
      <InputNumber min={0} max={100} defaultValue={0} size="large" />
    </Form.Item>
  </Form>
);

const Launch = ({ form }: {form: FormInstance}) => {
  const [cost, setCost] = useState(0);
  const { file, ...metadata } = form.getFieldsValue();
  const connection = networkStore((state) => state.connection);

  useEffect(() => {
    const rentCall = Promise.all([
      connection.getMinimumBalanceForRentExemption(MintLayout.span),
      connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    getAssetCostToStore([
      file,
      new File([JSON.stringify(metadata)], 'metadata.json'),
    ]).then(async (lamports) => {
      const sol = lamports / LAMPORT_MULTIPLIER;

      // TODO: cache this and batch in one call
      const [mintRent, metadataRent] = await rentCall;

      // const uriStr = 'x';
      // let uriBuilder = '';
      // for (let i = 0; i < MAX_URI_LENGTH; i++) {
      //   uriBuilder += uriStr;
      // }

      const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

      // TODO: add fees based on number of transactions and signers
      setCost(sol + additionalSol);
    });
  }, [files, metadata]);

  return <div>asd</div>;
};
