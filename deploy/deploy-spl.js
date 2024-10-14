import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { setupUmiClient } from "../utils/setupClient.js";

const umi = setupUmiClient().umi;
const userWallet = setupUmiClient().userWallet;

const metadata = {
  name: "Test Token",
  symbol: "TEST",
  uri: "https://ipfs.io/ipfs/QmdCQ63AhRdiHHvBGxkvo5eMmxrweXdkgZEw6ifeq2KEkP", //Replace with the actual URL of your metadata (token.json)
};

//Create a new Mint PDA
const mint = generateSigner(umi);
//Use Candy Machine to mint tokens
umi.use(mplCandyMachine());

//Send a transaction to deploy the Mint PDA and mint 1 million of our tokens
createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9,
  amount: 1000000_000000000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi).then(() => {
  console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
});
