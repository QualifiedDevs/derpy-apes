import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  contractAtom,
  isMintingAtom,
  costResultAtom,
} from "@src/global/mintContract";

import { useQuantity } from "@components/ChooseQuantity";

import { useWeb3 } from "@src/global/web3";

const MintButton = styled((props) => {
  const { signer, address } = useWeb3();

  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useAtom(isMintingAtom);
  const [costResult] = useAtom(costResultAtom);

  const [contract] = useAtom(contractAtom);

  const { quantity } = useQuantity();

  async function mint(quantity: number) {
    setIsLoading(true);
    setIsMinting(true);

    try {
      //TODO: Replace address definition with atom value
      const address = await signer.getAddress();
      console.log("SIGNER", contract.signer);

      const cost = costResult.data;
      if (!cost) throw `Cost Error: ${costResult.error}`;

      const totalCost = cost.mul(quantity);

      let gasEstimate;
      try {
        const res = await contract.estimateGas.mint(false, quantity, {
          from: address,
          value: totalCost,
        });
        gasEstimate = res;
      } catch (err) {
        console.error(err);
        console.log("Gas estimate failed, using manual estimate");
        gasEstimate = 100000 + 40000 * quantity;
      }
      console.log(`Estimated ${gasEstimate} gas to mint ${quantity} NFTs`);

      await contract.mint(false, quantity, {
        gasLimit: gasEstimate,
        value: totalCost,
      });
    } catch (err) {
      console.error(err);
    }

    setIsMinting(false);
    setIsLoading(false);
  }

  function handleClick() {
    mint(quantity);
  }

  return (
    <LoadingButton
      onClick={handleClick}
      loading={isLoading}
      disabled={!signer || isMinting}
      {...props}
    >
      Mint
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

export default MintButton;
