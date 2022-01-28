//@ts-nocheck

import React, { useContext, useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress } from "@mui/material";

// Multi button has to swap between
// Presale Mint and Public Mint

import useWeb3 from "@hooks/useWeb3";
import { QuantityContext } from "./ChooseQuantity";

const EthMintButton = styled(({ mintQuantity, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    mintContract,
    ethPrice,
    isPresale,
    isMinting,
    setIsMinting,
    presaleWhitelistAuth,
    connectedAccounts,
  } = useWeb3();

  // whitelistAuth vs public sale

  const mint = useCallback(async () => {
    setIsMinting(true);
    setIsLoading(true);
    // Mint with Quantity
    if (isPresale) {
      console.log("PRESALE MINT");
      const { hash, signature } = presaleWhitelistAuth!;

      console.log(false, mintQuantity, hash, signature);
      const contractMint = mintContract.methods.presaleMint(
        false,
        mintQuantity,
        hash,
        signature
      );
      try {
        const gasEstimate = await contractMint.estimateGas();
        console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          gasLimit: Math.floor(gasEstimate * 1.15),
          to: mintContract._address,
          from: connectedAccounts![0],
          value: Math.ceil(30000000000000000 * mintQuantity), //TODO: PULL VALUE FROM CONTRACT
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    } else {
      console.log("PUBLIC MINT");

      const contractMint = mintContract.methods.mint(false, mintQuantity);
      try {
        const gasEstimate = await contractMint.estimateGas();
        console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          gasLimit: Math.floor(gasEstimate * 1.15),
          to: mintContract._address,
          from: connectedAccounts![0],
          value: Math.ceil(30000000000000000 * mintQuantity), //TODO: PULL VALUE FROM CONTRACT
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    }
    setIsLoading(false);
    setIsMinting(false);
  }, [mintQuantity, isPresale, mintContract, ethPrice]);

  return (
    <Button onClick={mint} disabled={isLoading || isMinting} {...props}>
      {isMinting ? (
        isLoading ? (
          <CircularProgress size="1.5em" />
        ) : (
          "Waiting..."
        )
      ) : (
        "Mint with $ETH"
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

const LooksMintButton = styled(({ mintQuantity, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    mintContract,
    looksContract,
    looksPrice,
    isPresale,
    isMinting,
    setIsMinting,
    presaleWhitelistAuth,
    connectedAccounts,
    looksBalanceApproved,
  } = useWeb3();

  // whitelistAuth vs public sale

  const approveSpending = async () => {

    console.log(looksBalanceApproved)
    if (looksBalanceApproved > 18 * mintQuantity) return;

    console.log(mintContract._address, connectedAccounts[0])
    console.log(connectedAccounts[0])
    const approve = looksContract.methods.approve(
      mintContract._address,
      Math.ceil(18 * mintQuantity) //TODO: to bignumber
    );

    try {
      console.log("estimating gas");
      //? WHY can't I get this gas estimate?

      const gasEstimate = await approve.estimateGas();

      console.log("gas", gasEstimate);

      const res = await approve.send({
        gasLimit: Math.floor(gasEstimate * 1.15),
        to: looksContract._address,
        from: connectedAccounts[0],
      });
    } catch (err) {}
  };

  const mint = useCallback(async () => {
    setIsMinting(true);
    setIsLoading(true);
    // Mint with Quantity
    if (isPresale) {
      console.log("PRESALE MINT");
      await approveSpending();
      const { hash, signature } = presaleWhitelistAuth!;
      const contractMint = mintContract.methods.presaleMint(
        true,
        mintQuantity,
        hash,
        signature
      );
      try {
        const gasEstimate = await contractMint.estimateGas();
        console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          gasLimit: Math.floor(gasEstimate * 1.15),
          to: mintContract._address,
          from: connectedAccounts![0],
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    } else {
      console.log("PUBLIC MINT");
      await approveSpending();
      const contractMint = mintContract.methods.mint(true, mintQuantity);
      try {
        const gasEstimate = await contractMint.estimateGas();
        console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          gasLimit: Math.floor(gasEstimate * 1.15),
          to: mintContract.__address,
          from: connectedAccounts![0],
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    }
    setIsLoading(false);
    setIsMinting(false);
  }, [
    mintQuantity,
    isPresale,
    mintContract,
    looksContract,
    looksBalanceApproved,
    looksPrice,
    connectedAccounts,
  ]);

  return (
    <Button onClick={mint} disabled={isLoading || isMinting} {...props}>
      {isMinting ? (
        isLoading ? (
          <CircularProgress size="1.5em" />
        ) : (
          "Waiting..."
        )
      ) : looksBalanceApproved < 18 ? (
        "Approve $LOOKS"
      ) : (
        "Mint with $LOOKS"
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

const MultiButton = styled((props) => {
  const { quantity } = useContext(QuantityContext);

  return (
    <Box {...props} sx={{ mt: 4 }}>
      <EthMintButton mintQuantity={quantity} variant="contained" />
      <LooksMintButton mintQuantity={quantity} variant="contained" />
    </Box>
  );
})`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;

  .MuiButton-root {
    padding: 1em;
  }
`;

export default MultiButton;
