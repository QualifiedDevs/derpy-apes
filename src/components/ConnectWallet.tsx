import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Button, CircularProgress } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { ethers } from "ethers";

import isClient from "@utils/isClient";
import web3Modal from "@utils/web3Modal";

import { useAtom } from "jotai";
import { useWeb3, runFetchAddressAtom } from "@src/global/web3";

const ConnectWallet = styled((props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { connect, signer } = useWeb3();

  const handleClick = async () => {
    if (!isClient) return;
    setIsLoading(true);

    try {
      const res = await web3Modal!.connect(); //? Why isn't this working?
      const provider = new ethers.providers.Web3Provider(res);
      connect(provider);
      console.log("Connection Successful");
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <LoadingButton onClick={handleClick} loading={isLoading} disabled={signer} {...props}>
      {signer ? "Connected" : "Connect a Wallet"}
    </LoadingButton>
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