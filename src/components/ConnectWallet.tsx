import React, { useState } from "react";

import { styled } from "@mui/material/styles";
import { Button, CircularProgress } from "@mui/material";

import useWeb3 from "@hooks/useWeb3";
import { isClient } from "@utils";

import { web3Modal } from "@utils/web3Modal";

const ConnectWallet = styled((props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { connected, setProvider } = useWeb3();

  const connect = async () => {
    if (!isClient()) return;
    setIsLoading(true);

    let provider;
    try {
      provider = await web3Modal?.connect();
    } catch (err) {
      console.error(err);
    }
    setProvider!(provider); //* DOESN'T RE-RENDER IF STATE IS THE SAME
    setIsLoading(false);
  };

  return (
    <Button onClick={connect} disabled={isLoading || connected} {...props}>
      {isLoading ? (
        <CircularProgress size="1.5em" sx={{ m: ".25em" }} />
      ) : connected ? (
        "Connected"
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
})`

  .MuiCircularProgress-root {
    color: white;
  }

  &.Mui-disabled {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export default ConnectWallet;