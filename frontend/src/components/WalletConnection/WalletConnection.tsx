import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Modal from "../Modal/Modal";

//handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

type WalletConnectionProps = {
  isOpen: boolean;
  handleCloseModal: () => void;
};

const WalletConnection = ({ isOpen, handleCloseModal }: WalletConnectionProps) => {
  const { select, wallets } = useWallet();

  const [myWallets, setMyWallets] = useState<any>([]);

  useEffect(() => {
    // filter wallet to only show Phantom and Backpack
    const w = wallets.filter((wallet) => wallet.adapter.name === "Phantom");
    setMyWallets(w);
  }, [wallets]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      // if myWallets wallet name is walletName and myWallets wallet.readyState === "NotDetected" then redirect to wallet.adapter.url
      const wallet = myWallets.find((w: any) => w.adapter.name === walletName);
      if (wallet.readyState === "NotDetected") {
        window.open(wallet.adapter.url, "_blank");
        return;
      } else {
        try {
          select(walletName);
          handleCloseModal();
        } catch (error) {
          console.log("wallet connection err : ", error);
        }
      }
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            padding: 54,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: 900,
                lineHeight: "25.2px",
                textAlign: "center",
                color: "#000000",
                marginBottom: 16,
              }}
            >
              CONNECT WALLET
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 200,
                lineHeight: "27px",
                letterSpacing: "-0.18px",
                textAlign: "center",
                color: "#000000",
                marginBottom: 32,
              }}
            >
              Please connect wallet to continue. The system support the
              following wallets.
            </div>
            {myWallets.map((wallet: any) => (
              <div
                key={wallet.adapter.name}
                onClick={() => handleWalletSelect(wallet.adapter.name)}
                style={{
                  // w: '200px',
                  width: "100%",
                  backgroundColor: "#D8C0FB",
                  height: 46,
                  border: "3px solid #000000",
                  // boxShadow: '0px -5px 0px 0px #000000 inset',
                  textTransform: "uppercase",
                  fontSize: "20px",
                  color: "white",
                  // fontFamily: 'slackey',
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderRadius: "12px",
                  gap: 12,
                  padding: "16px 24px 16px 24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    // borderRadius: '50%',
                  }}
                >
                  <Image
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    height={30}
                    width={30}
                  />
                </div>
                <div
                  style={{
                    // fontFamily: 'Rubik One',
                    fontSize: "24px",
                    fontWeight: 800,
                    lineHeight: "29.71px",
                    textAlign: "center",
                    // "-webkit-text-stroke": "1px black",
                  }}
                >
                  {wallet.adapter.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WalletConnection;
