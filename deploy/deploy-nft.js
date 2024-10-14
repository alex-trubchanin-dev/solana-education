import { create, mplCore } from "@metaplex-foundation/mpl-core";
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
  createSignerFromKeypair
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";
import secret from '../secret.json' assert { type: 'json' };

// Create the wrapper function
const createNft = async () => {
  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplCore())
    .use(
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: "https://devnet.irys.xyz",
      })
    );

  // Generate a new keypair signer.
  // const signer = generateSigner(umi);

  // // You will need to us fs and navigate the filesystem to
  // // load the wallet you wish to use via relative pathing.
  // const walletFile = fs.readFileSync("./secret.json");

  // // Convert your walletFile onto a keypair.
  // let keypair = umi.eddsa.createKeypairFromSecretKey(
  //   new Uint8Array(walletFile)
  // );

  const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);

  // Load the keypair into umi.
  umi.use(signerIdentity(userWalletSigner));

  const asset = generateSigner(umi);

  const tx = await create(umi, {
    asset,
    name: "My NFT",
    uri: "https://arweave.net/1234567890",
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(tx.signature)[0];
};

// run the wrapper function
createNft();
