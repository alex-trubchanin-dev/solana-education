"use client";

import { useState } from "react";
import WalletConnection from "@/components/WalletConnection/WalletConnection";
import { tokenMintPublicKey } from "@/constants/constants";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProgram } from "@/hooks/useAnchorProgram";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useBalance } from "@/hooks/useBalance";
import { SystemProgram } from "@solana/web3.js";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { program } = useAnchorProgram();
  const { disconnect, connected, publicKey } = useWallet();
  const { balance, updateBalance } = useBalance();

  const burnTokens = async () => {
    if (!publicKey || !program) {
      console.error("Wallet not connected or program not initialized");
      return;
    }

    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      publicKey
    );

    try {
      const tx = await program.methods
        .burnTokens()
        .accounts({
          user: publicKey,
          tokenAccount: userTokenAccount,
          tokenMint: tokenMintPublicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([])
        .rpc();

      console.log("Tokens successfully burned!");
      console.log("Transaction signature:", tx);
      updateBalance();
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center mb-4">
        {connected ? (
          <button
            onClick={disconnect}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Connect Wallet
          </button>
        )}
      </div>
      <WalletConnection
        isOpen={isOpen}
        handleCloseModal={() => setIsOpen(false)}
      />
      <div className="flex flex-col items-center justify-center">
        <p>Token Balance: {balance}</p>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <button
          onClick={burnTokens}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
        >
          Burn 10 Tokens
        </button>
      </div>
    </div>
  );
}
