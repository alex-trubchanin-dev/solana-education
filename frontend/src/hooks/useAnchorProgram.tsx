"use client";

import { useEffect, useState, useMemo, createContext, useContext } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
// import {
//   AnchorProvider,
//   Program,
//   Idl,
//   setProvider,
//   Wallet,
// } from "@project-serum/anchor";
import { AnchorProvider, Program, Idl, setProvider, Wallet } from '@coral-xyz/anchor';
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../utils/idl/idl.json";

// Create a context for the AnchorProgram
const AnchorProgramContext = createContext<any>(null);

// Create a provider component
export const AnchorProgramProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [programState, setProgramState] = useState<any | null>(null);

  // Memoize the provider to avoid recalculating it on each render
  const provider = useMemo(() => {
    if (!connection) return null;
    return new AnchorProvider(connection, anchorWallet ?? ({} as Wallet), {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    });
  }, [anchorWallet, connection]);

  // Memoize the program instance
  const programInstance = useMemo(() => {
    if (!provider) return null;
    setProvider(provider);
    return new Program(idl as Idl, provider);
  }, [provider]);

  // Only set programState if programInstance is available
  useEffect(() => {
    if (programInstance) {
      setProgramState(programInstance);
    }
  }, [programInstance]);

  return (
    <AnchorProgramContext.Provider value={{ program: programState, provider }}>
      {children}
    </AnchorProgramContext.Provider>
  );
};

// Create a custom hook to use the AnchorProgram context
export const useAnchorProgram = () => {
  const context = useContext(AnchorProgramContext);
  if (context === undefined) {
    throw new Error("useAnchorProgram must be used within an AnchorProgramProvider");
  }
  return context;
};
