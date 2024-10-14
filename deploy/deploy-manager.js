import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, generateSigner } from '@metaplex-foundation/umi';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import secret from '../secret.json' assert { type: 'json' };

(async () => {
  // Initialize Umi
  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata())
    .use(irysUploader({ address: "https://devnet.irys.xyz" }));

  // Load user wallet
  const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
  const userWalletSigner = createSignerFromKeypair(umi, userWallet);

  // Use the user's wallet as the identity
  umi.use(signerIdentity(userWalletSigner));

  // Airdrop SOL to the authority to cover transaction fees
  await umi.rpc.airdrop(userWalletSigner.publicKey, 2 * LAMPORTS_PER_SOL);

  // Create the manager state account PDA (not used directly here, just for reference)
  const [managerStatePda, _] = await PublicKey.findProgramAddress(
    [Buffer.from("manager-state")],
    new PublicKey("Rp8z8VbDF3ofHwjjVrH3fD6pouF9wLEnsuJNWoqJNY6")
  );

  // Create mint accounts for token and NFT
  const tokenMint = generateSigner(umi);
  const nftMint = generateSigner(umi);

  // const tx = await create(umi, {
  //   asset,
  //   name: "My NFT",
  //   uri: "https://arweave.net/1234567890",
  // }).sendAndConfirm(umi);

  console.log("Manager program setup successfully");
  console.log("Manager State PDA (for reference):", managerStatePda.toBase58());
  console.log("Token Mint Address:", tokenMint.publicKey);
  console.log("NFT Mint Address:", nftMint.publicKey);
})();
