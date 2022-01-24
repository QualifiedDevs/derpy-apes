import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress } from "@mui/material";

import { getMintAuth } from "@utils";

import { useWeb3 } from "./Web3Connection";

import type { AuthData } from "@api/authorizePresaleMint";

const PresaleMint = styled((props) => {
  const {
    contract,
    whitelistAuth,
    setWhitelistAuth,
    clientAddress,
    isMinting,
    setIsMinting,
  } = useWeb3();

  // Check authorization
  useEffect(() => {
    if (!clientAddress) return;
    (async () => {
      console.log("requesting auth for", clientAddress);
      const res = await getMintAuth(clientAddress);
      setWhitelistAuth!(res);
    })();
  }, [clientAddress]);

  return (
    <Box {...props}>
      <Button disabled={!whitelistAuth}>
        {whitelistAuth === undefined
          ? "Requesting Authorization..."
          : whitelistAuth
          ? "Whitelist Authorized"
          : "Whitelist Authorization Denied"}
      </Button>
      <Button
        variant={"contained"}
        onClick={() => {
          if (!whitelistAuth || !setIsMinting) return;
          setIsMinting(true);
          (async () => {
            const { hash, signature } = whitelistAuth;
            try {

                console.log("contract address:", contract._address);
                console.log("client address:", clientAddress);
                console.log("hash:", hash)
                console.log("signature:", signature)

              const res = await contract.methods
                .presaleMint(false, 1, hash, signature)
                .send({
                  gasLimit: "30000000000000000",
                  to: contract._address,
                  from: clientAddress,
                  value: 30000000000000000, //18800000000000000000
                });
                console.log("Response received:", res);
            } catch (err) {

            }
            setIsMinting(false);
          })();
        }}
      >
        {isMinting ? <CircularProgress color="success" /> : "Mint with $ETH"}
      </Button>
      <Button variant={"contained"}>Mint with $LOOKS</Button>
    </Box>
  );
})``;

export default PresaleMint;
