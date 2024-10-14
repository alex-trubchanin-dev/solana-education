import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { tokenMintPublicKey, nftMintPublicKey } from "../constants/constants";

export const useBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const updateBalances = async () => {
    if (!publicKey) {
      setBalance(null);
      setNftBalance(null);
      return;
    }

    try {
      const tokenAccount = await getAssociatedTokenAddress(tokenMintPublicKey, publicKey);
      const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccount);
      setBalance(Number(tokenAccountInfo.value.amount));

      const nftAccount = await getAssociatedTokenAddress(nftMintPublicKey, publicKey);
      const nftAccountInfo = await connection.getTokenAccountBalance(nftAccount);
      setNftBalance(Number(nftAccountInfo.value.amount));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  useEffect(() => {
    updateBalances();
    // Опционально: добавьте интервал для периодического обновления балансов
    const interval = setInterval(updateBalances, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return { balance, nftBalance, updateBalances };
};
