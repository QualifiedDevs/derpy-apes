//@ts-nocheck

import React, { useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import useWeb3 from "@hooks/useWeb3";

const FreeMint = styled((props) => {
  const {
    mintContract,
    freeMintWhitelistAuth,
    isMinting,
    setIsMinting,
    connectedAccounts,
    freeMintMax,
  } = useWeb3();

  const mint = async () => {
    console.log("FREE MINT");
    setIsMinting(true);
    const { hash, signature } = freeMintWhitelistAuth!;

    console.log("FREE MINT", hash, signature)

    const contractMint = mintContract.methods.freeMint(
      2,
      hash,
      signature
    );

    try {
      // const gasEstimate = await contractMint.estimateGas();
      // console.log("gasEstimate", gasEstimate);

      // const res = await contractMint.send({
      //   gasLimit: Math.floor(gasEstimate * 1.15),
      //   to: mintContract._address,
      //   from: connectedAccounts[0],
      // });

      console.log(
        "Mint Address", mintContract._address,
        "From", connectedAccounts[0]
      )

      const res = await contractMint.send({
        gasLimit: Math.floor(250000),
        to: mintContract._address,
        from: connectedAccounts[0]
      })

      console.log(res);
    } catch (err) {
      console.error(err);
    }
    setIsMinting(false);
  };

  return (
    <LoadingButton
      onClick={mint}
      disabled={!freeMintWhitelistAuth}
      loading={isMinting}
      {...props}
      variant="contained"
    >
      {/* {freeMintWhitelistAuth
        ? freeMintAvailable
          ? `Mint ${freeMintMax || 0} Free`
          : freeMintAvailable === undefined
          ? "Fetching Mint History..."
          : "Free Mint Limit Exceeded"
        : freeMintWhitelistAuth === undefined
        ? "Fetching Authorization..."
        : "Free Mint Not Allowed"} */}
        {
          freeMintWhitelistAuth? `Mint 2 Free` : "Minting Not Allowed"
        }

    </LoadingButton>
  );
})`
  padding: 1.5em;
\
  &.Mui-disabled {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export default FreeMint;
