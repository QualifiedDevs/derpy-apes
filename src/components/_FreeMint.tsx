//@ts-nocheck

import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress } from "@mui/material";

import useWeb3 from "@hooks/useWeb3";

import { isClient } from "@utils";

const FreeMint = styled((props) => {
  const { freeMintAllowed, setFreeMintAllowed, contract, clientAddress } =
    useWeb3();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isClient() || !contract || !clientAddress) return;
    (async () => {
      console.log("client address", clientAddress);
      const res = await contract.methods.avaliableFreeMint(1).call({
        from: clientAddress,
      });
      console.log("availableFreeMint", res);
    })();
  }, [contract]);

  //Check for freeMintAllowed

  return (
    <Button
      onClick={() => {
        (async () => {
          if (!contract) return;
          setIsLoading(true);
          try {
            const res = await contract.methods.freeMint(1).send({
              gasLimit: "250000",
              to: contract._address,
              from: clientAddress,
              // value: 30000000000000000, //18800000000000000000
            });
          } catch (err) {
            console.error(err);
          }
          setIsLoading(false);
        })();
      }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <CircularProgress /> : "Free Mint"}
    </Button>
  );
})``;

export default FreeMint;