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
    projectStage,
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
    if (projectStage == 1) {
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
        // const gasEstimate = await contractMint.estimateGas({
        //   from: connectedAccounts[0],
        //   value: Math.ceil(ethPrice * mintQuantity),
        // });

        // console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          // gasLimit: Math.floor(gasEstimate * 1.15),
          gasLimit: Math.floor(250000 + mintQuantity * 50000),
          to: mintContract._address,
          from: connectedAccounts![0],
          value: Math.ceil(ethPrice * mintQuantity), //TODO: PULL VALUE FROM CONTRACT
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    } else {
      console.log("PUBLIC MINT");
      const contractMint = mintContract.methods.mint(false, mintQuantity);
      try {
        console.log("ESTIMATING GAS>>>")
        // const gasEstimate = await contractMint.estimateGas({
        //   from: connectedAccounts[0],
        //   value: Math.ceil(ethPrice * mintQuantity),
        // });
        // console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          // gasLimit: Math.floor(gasEstimate * 1.15),
          gasLimit: Math.floor(200000 + mintQuantity * 50000),
          to: mintContract._address,
          from: connectedAccounts![0],
          value: Math.ceil(ethPrice * mintQuantity), //TODO: PULL VALUE FROM CONTRACT
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    }
    setIsLoading(false);
    setIsMinting(false);
  }, [mintQuantity, projectStage, mintContract, ethPrice]);
//
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
    projectStage,
    isMinting,
    setIsMinting,
    presaleWhitelistAuth,
    connectedAccounts,
    looksBalanceApproved,
    setPresaleWhitelistAuth,
    setLooksBalanceApproved,
  } = useWeb3();

  const approveSpending = async () => {
    if (looksBalanceApproved >= looksPrice * mintQuantity) return;
    setIsLoading(true);

    // * Something wrong with method instance?
    // ! This isn't working!
    console.log("LOOKS PRICE", looksPrice)
    const approve = looksContract.methods.approve(
      mintContract._address,
      Math.ceil(looksPrice * 50).toString()
    );

    try {
      // const gasEstimate = await approve.estimateGas({
      //   from: connectedAccounts[0],
      // });

      // console.log("gas estimate:", gasEstimate);

      const res = await approve.send({
        gasLimit: Math.floor(25000),
        to: looksContract._address,
        from: connectedAccounts[0],
      });

      const newBalance = await await looksContract.methods.allowance(
        connectedAccounts[0],
        mintContract._address
      );
      setLooksBalanceApproved(newBalance);
      // !prompt balance update
    } catch (err) {
      console.error("Gas Estimate Failed", err);
    }
    setIsLoading(false);
  };

  const mint = useCallback(async () => {
    setIsMinting(true);
    setIsLoading(true);
    // Mint with Quantity
    if (projectStage == 1) {
      console.log("PRESALE MINT");
      const { hash, signature } = presaleWhitelistAuth!;
      const contractMint = mintContract.methods.presaleMint(
        true,
        mintQuantity,
        hash,
        signature
      );

      try {
        // const gasEstimate = await contractMint.estimateGas({
        //   from: connectedAccounts[0],
        // });
        // console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          // gasLimit: Math.floor(gasEstimate * 1.15),
          gasLimit: Math.floor(250000 + mintQuantity * 50000),
          to: mintContract._address,
          from: connectedAccounts![0],
        });
        console.log("TRANSACTION APPROVED", res);
      } catch (err) {
        console.error("TRANSACTION FAILED", err);
      }
    } else {
      console.log("PUBLIC MINT");
      const contractMint = mintContract.methods.mint(true, mintQuantity);
      try {
        // const gasEstimate = await contractMint.estimateGas({
        //   from: connectedAccounts[0],
        // });
        // console.log("gasEstimate", gasEstimate);
        const res = await contractMint.send({
          gasLimit: Math.floor(250000 + mintQuantity * 50000),
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
    projectStage,
    mintContract,
    looksContract,
    looksBalanceApproved,
    looksPrice,
    connectedAccounts,
  ]);

  return (
    <Button
      onClick={
        looksBalanceApproved < looksPrice * mintQuantity
          ? approveSpending
          : mint
      }
      disabled={isLoading || isMinting}
      {...props}
    >
      {isMinting ? (
        isLoading ? (
          <CircularProgress size="1.5em" />
        ) : (
          "Waiting..."
        )
      ) : looksBalanceApproved < mintQuantity * looksPrice ? (
        `Approve $LOOKS`
      ) : (
        `Mint with $LOOKS`
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
      <LooksMintButton mintQuantity={quantity} variant="contained" disabled />
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