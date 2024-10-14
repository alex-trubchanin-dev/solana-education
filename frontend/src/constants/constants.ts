import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Cluster, PublicKey, clusterApiUrl } from '@solana/web3.js';

export const cluster: Cluster = (process.env.NEXT_PUBLIC_CLUSTER as Cluster) || 'devnet';
export const endpoint: string =
  process.env.NEXT_PUBLIC_ENDPOINT || clusterApiUrl(WalletAdapterNetwork.Devnet);

export const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string);

export const nftMintPublicKey = new PublicKey(process.env.NEXT_PUBLIC_NFT_MINT_ADDRESS as string);
export const tokenMintPublicKey = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS as string);
export const tokenProgramId = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_PROGRAM_ID as string);
