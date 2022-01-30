//@ts-nocheck

import React, {useCallback} from "react"
import { styled } from "@mui/material/styles";
import { Button, CircularProgress } from "@mui/material";

import useWeb3 from "@hooks/useWeb3";

const FreeMint = styled((props) => {
  const {
    mintContract,
    freeMintAvailable,
    freeMintWhitelistAuth,
    isMinting,
    setIsMinting,
    connectedAccounts,
    freeMintMax
  } = useWeb3();

  const mint = async () => {
    console.log("FREE MINT");
    setIsMinting(true);
    const { hash, signature } = freeMintWhitelistAuth!;
    const contractMint = mintContract.methods.freeMint(freeMintMax || 0, hash, signature);
    try {
      const gasEstimate = await contractMint.estimateGas()
      console.log("gasEstimate", gasEstimate);
      const res = await contractMint.send({
        gasLimit: Math.floor(gasEstimate * 1.15),
        to: mintContract._address,
        from: connectedAccounts[0],
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
    setIsMinting(false);
  };

  return (
    <Button
      onClick={mint}
      disabled={!freeMintWhitelistAuth || isMinting || !freeMintAvailable}
      {...props}
      variant="contained"
    >
      {freeMintAvailable? freeMintWhitelistAuth === undefined
        ? "Requesting Free Mint Whitelist..."
        : freeMintWhitelistAuth
        ? `Mint ${freeMintMax || 0} Free`
        : "Free Mint Whitelist Unavailable" : "Free Mints Exceeded"}
    </Button>
  );
})`
  padding: 1.5em;
  .MuiCircularProgress-root {
    color: white;
  }

  &.Mui-disabled {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export default FreeMint;
