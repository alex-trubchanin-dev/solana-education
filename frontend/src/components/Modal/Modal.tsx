import React, { useEffect } from "react";
// import { ModalProps } from ".";
// import Box from "../Box/Box";
// import Image from "../Image";
import Image from "next/image";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, width = "524px", children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5, 7, 8, 0.5)",
        backdropFilter: "blur(5px)",
        zIndex: 1000,
      }}
    >
      {/* onClick={onClose}
    > */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: width,
          position: "relative",
          border: "3px solid #32303D",
        }}
      >
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "44px",
            height: "44px",
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            border: "3px solid #000000",
            borderRadius: "12px",
            boxShadow: "0px -2px 0px 0px #000000 inset",
            backgroundColor: "white",
          }}
        >
          <Image
            src={"/images/formIcons/close-modal-icon-new.svg"}
            alt="close-modal-button"
            width={15}
            height={15}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
