"use client";

import { FC, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { endpoint } from '../constants/constants';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const walletEndpoint = useMemo(() => endpoint, []);

  //wallets
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    [walletEndpoint],
  );

  return (
    <ConnectionProvider endpoint={walletEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
