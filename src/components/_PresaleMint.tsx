//@ts-nocheck

import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import { Box, Button, CircularProgress } from "@mui/material";

import { getMintAuth, isClient } from "@utils";

import { useWeb3 } from "./Web3Connection";

import type { AuthData } from "@api/authorizePresaleMint";

const LooksButton = styled((props) => {

  const { contract, looksContract, clientAddress, whitelistAuth } = useWeb3();

  const [looksBalanceApproved, setLooksBalanceApproved] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Update Looks Balance
  useEffect(() => {
    if (!isClient() || !clientAddress || !contract || !looksContract) return;

    contract.methods.isPresale().call().then(res => {
        console.log("isPresale", res)
    });

    (async () => {
      const res = await looksContract.methods
        .allowance(clientAddress, contract._address)
        .call();
        console.log("$LOOKS balance approved:", res)
      setLooksBalanceApproved(res);
    })();
  }, [clientAddress, contract, looksContract, isLoading]);

  const mintPrice = 18;

  return (
    <Button
      onClick={
        looksBalanceApproved < 18
          ? () => {
              if (!isClient || !contract || !looksContract || !clientAddress)
                return;
              (async () => {
                //approve looks balance
                setIsLoading(true);
                try {
                  const res = await looksContract.methods
                    .approve(contract._address, 18)
                    .send({
                      gasLimit: "250000",
                      to: looksContract._address,
                      from: clientAddress,
                    });
                    console.log("Spending Approved", res)

                } catch (err) {
                    console.error(err)
                }
                setIsLoading(false);
              })();
            }
          : () => {
              (async () => {
                if (
                  !isClient ||
                  !contract ||
                  !looksContract ||
                  !clientAddress ||
                  !whitelistAuth
                )
                  return;
                //mint with looks
                setIsLoading(true);
                const { hash, signature } = whitelistAuth;
                try {
                  const res = await contract.methods
                    .presaleMint(true, 1, hash, signature)
                    .send({
                      gasLimit: "250000",
                      to: contract._address,
                      from: clientAddress,
                    });
                  console.log("Minted one with $LOOKS:", res);
                } catch (err) {
                  console.error(err);
                }
                setIsLoading(false);
                // Response received
              })();
            }
      }
      {...props}
    >
      {isLoading ? (
        <CircularProgress />
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
`;

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
              console.log("hash:", hash);
              console.log("signature:", signature);

              const res = await contract.methods
                .presaleMint(false, 1, hash, signature)
                .send({
                  gasLimit: "250000",
                  to: contract._address,
                  from: clientAddress,
                  value: 30000000000000000, //18800000000000000000
                });
              console.log("Response received:", res);
            } catch (err) {}
            setIsMinting(false);
          })();
        }}
      >
        {isMinting ? <CircularProgress color="success" /> : "Mint with $ETH"}
      </Button>
      <LooksButton variant="contained" />
    </Box>
  );
})``;

export default PresaleMint;