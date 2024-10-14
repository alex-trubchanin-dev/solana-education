import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Manager } from "../target/types/manager";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo } from "@solana/spl-token";
import { expect } from "chai";

describe("manager", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Manager as Program<Manager>;
  
  let tokenMint: anchor.web3.PublicKey;
  let nftMint: anchor.web3.PublicKey;
  let userTokenAccount: anchor.web3.PublicKey;
  let userNftAccount: anchor.web3.PublicKey;
  let tokenPool: anchor.web3.PublicKey;
  let poolAuthority: anchor.web3.Keypair;

  before(async () => {
    // Setup token mint and accounts
    tokenMint = await createMint(provider.connection, provider.wallet.payer, provider.wallet.publicKey, null, 9);
    userTokenAccount = await createAccount(provider.connection, provider.wallet.payer, tokenMint, provider.wallet.publicKey);
    await mintTo(provider.connection, provider.wallet.payer, tokenMint, userTokenAccount, provider.wallet.payer, 100);

    // Setup NFT mint and accounts
    nftMint = await createMint(provider.connection, provider.wallet.payer, provider.wallet.publicKey, null, 0);
    userNftAccount = await createAccount(provider.connection, provider.wallet.payer, nftMint, provider.wallet.publicKey);

    // Setup token pool
    poolAuthority = anchor.web3.Keypair.generate();
    tokenPool = await createAccount(provider.connection, provider.wallet.payer, tokenMint, poolAuthority.publicKey);
    await mintTo(provider.connection, provider.wallet.payer, tokenMint, tokenPool, provider.wallet.payer, 1000);
  });

  it("Burns tokens for NFT", async () => {
    const initialTokenBalance = await provider.connection.getTokenAccountBalance(userTokenAccount);
    const initialNftBalance = await provider.connection.getTokenAccountBalance(userNftAccount);

    await program.methods.burnTokensForNft()
      .accounts({
        user: provider.wallet.publicKey,
        tokenAccount: userTokenAccount,
        tokenMint: tokenMint,
        nftMint: nftMint,
        nftAccount: userNftAccount,
        nftAuthority: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const finalTokenBalance = await provider.connection.getTokenAccountBalance(userTokenAccount);
    const finalNftBalance = await provider.connection.getTokenAccountBalance(userNftAccount);

    expect(Number(initialTokenBalance.value.amount) - Number(finalTokenBalance.value.amount)).to.equal(10);
    expect(Number(finalNftBalance.value.amount) - Number(initialNftBalance.value.amount)).to.equal(1);
  });

  it("Burns NFT for tokens", async () => {
    const initialTokenBalance = await provider.connection.getTokenAccountBalance(userTokenAccount);
    const initialNftBalance = await provider.connection.getTokenAccountBalance(userNftAccount);
    const initialPoolBalance = await provider.connection.getTokenAccountBalance(tokenPool);

    await program.methods.burnNftForTokens()
      .accounts({
        user: provider.wallet.publicKey,
        nftAccount: userNftAccount,
        nftMint: nftMint,
        tokenAccount: userTokenAccount,
        tokenPool: tokenPool,
        poolAuthority: poolAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([poolAuthority])
      .rpc();

    const finalTokenBalance = await provider.connection.getTokenAccountBalance(userTokenAccount);
    const finalNftBalance = await provider.connection.getTokenAccountBalance(userNftAccount);
    const finalPoolBalance = await provider.connection.getTokenAccountBalance(tokenPool);

    expect(Number(finalTokenBalance.value.amount) - Number(initialTokenBalance.value.amount)).to.equal(10);
    expect(Number(initialNftBalance.value.amount) - Number(finalNftBalance.value.amount)).to.equal(1);
    expect(Number(initialPoolBalance.value.amount) - Number(finalPoolBalance.value.amount)).to.equal(10);
  });
});
