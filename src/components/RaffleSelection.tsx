//@ts-nocheck

import React, { useState, useMemo, useEffect } from "react";
import { useAtom } from "jotai";

import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  Paper,
  ButtonBase,
  CircularProgress,
  Modal,
} from "@mui/material";

import type { Raffle, Entry } from "@utils/raffleServerAPI";
import { createRaffleEntry } from "@utils/raffleClientAPI";
import { requestSignatureAuth } from "@utils/auth";

import { LoadingButton } from "@mui/lab";

import OpenseaIcon from "@src/vector-graphics/marketplaces/opensea";
import manifest from "@src/manifest.json";
const openseaLink = manifest.marketplaces.opensea;

import Image from "next/image";

import ConnectWallet from "@components/ConnectWallet";

import { signerAtom, useWeb3 } from "@src/global/web3";

import { contractAtom, ownedNFTsResultAtom } from "@src/global/mintContract";
import {
  enteredNFTResponseAtom,
  runFetchEnteredNFTResponseAtom,
} from "@src/global/raffle";

import { getTokenImageURI } from "@utils/tokenMetadata";
import formatRes from "@utils/formatRes";

const TokenImage = styled(({ tokenId, size, ...props }: any) => {
  const [imageURI, setImageURI] = useState<string>("/mockups/1.png");

  const [contract] = useAtom(contractAtom);

  useMemo(() => {
    (async () => {
      const imageURI = await getTokenImageURI(tokenId, contract);
      setImageURI(imageURI);
    })();
  }, [tokenId]);

  return (
    <Box {...props}>
      <Image src={imageURI} width={size} height={size} />
    </Box>
  );
})`
  img {
    pointer-events: none;
  }
`;

//! Why is there a width issue?
const SelectableNFT = styled(
  ({
    tokenId,
    setTokenId,
    ...props
  }: {
    tokenId: string;
    setTokenId: React.Dispatch<string | null>;
  }) => {
    function handleClick() {
      setTokenId(tokenId);
    }

    return (
      <ButtonBase onClick={handleClick} {...props}>
        <TokenImage tokenId={tokenId} size={150} />
      </ButtonBase>
    );
  }
)`
  background: ${({ theme }) => theme.palette.secondary.dark};
  border-radius: 8px;
  padding: 0.25em;
  padding-bottom: 0.08em;

  * {
    border-radius: inherit;
  }

  transition: transform 0.15s, background 0.15s, padding 0.15s;

  :hover {
    transform: scale(1.05, 1.05);
    background: ${({ theme }) => theme.palette.primary.main};
  }
`;

const OwnedNFTsSelection = styled(
  ({
    ownedNFTs,
    setTokenId,
    ...props
  }: {
    ownedNFTs: any;
    setTokenId: React.Dispatch<string | null>;
  }) => {
    const walletNFTs = useMemo(() => {
      return ownedNFTs.map((tokenId: string) => (
        <SelectableNFT
          tokenId={tokenId.toString()}
          setTokenId={setTokenId}
          key={tokenId.toString()}
        />
      ));
    }, [ownedNFTs]);
    return <Box {...props}>{walletNFTs}</Box>;
  }
)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 150px);
  justify-content: center;
  grid-gap: 1rem;
`;

const SelectionModal = styled(
  ({
    raffle,
    signer,
    tokenId,
    setTokenId,
    setEnteredNFT,
    ...props
  }: {
    raffle: Raffle;
    tokenId: string;
    setTokenId: React.Dispatch<string | null>;
    setEnteredNFT: React.Dispatch<string>;
    signer: any;
  }) => {
    function handleClose() {
      setTokenId(null);
    }

    async function enterNFT(tokenId: string) {
      const walletAddress = await signer.getAddress();
      const signature = await requestSignatureAuth(signer, "Enter Raffle");

      const entry: Entry = {
        walletAddress,
        tokenId: tokenId.toString(),
        isWinner: false,
      };

      const [data, err] = await formatRes(createRaffleEntry(raffle.id!, entry));
      if (err) {
        console.error(
          `Failed to create raffle entry with id ${raffle.id} and props ${entry}`,
          err
        );
        return;
      }
      setEnteredNFT(tokenId);
    }

    function handleClick() {
      enterNFT(tokenId);
      handleClose();
    }

    return (
      <Modal open={!!tokenId} onClose={handleClose} {...props}>
        <Box className="modal-content">
          <Paper className="token-image" sx={{ mb: 4 }}>
            <TokenImage tokenId={tokenId} size={200} />
          </Paper>
          <Button
            onClick={handleClick}
            variant="contained"
            sx={{ py: 1.5, px: 2 }}
          >
            {tokenId && `Enter #${tokenId.toString()} into Raffle`}
          </Button>
        </Box>
      </Modal>
    );
  }
)`
  display: grid;
  place-items: center;

  .modal-content {
    display: flex;
    flex-direction: column;

    align-items: center;

    .token-image {
      padding: 0.5em;
      border-radius: 12px;
      // background: ${({ theme }) => theme.palette.primary.light};

      * {
        border-radius: inherit;
      }
    }
  }
`;

const EnteredNFT = styled(({ tokenId, ...props }: { tokenId: string }) => {
  return (
    <Paper {...props}>
      <TokenImage tokenId={tokenId} size={250} sx={{ mb: 0 }} />
      <Paper className="label">
        <Typography>Derpy Ape #{tokenId.toString()}</Typography>
      </Paper>
    </Paper>
  );
})`
  background: ${({ theme }) => theme.palette.secondary.main};
  padding: 0.5em;

  * {
    border-radius: inherit;
  }

  .label {
    background: ${({ theme }) => theme.palette.primary.main};
    font-size: 1.2rem;
    padding: 0.4em 0;
    text-align: center;
    text-transform: uppercase;
    p {
      font-size: 1em;
      font-weight: 600;
    }
  }
`;

//! State for isAwaitingSelection
//! Once confirmed, enteredNFT atm from raffle to our NFT!

const RaffleSelection = styled(({ raffle, ...props }: { raffle: Raffle }) => {
  //TODO: When address is changed, fetch NFTs from blockchain or opensea + Entered Ape from Server > Notion

  const { signer } = useWeb3();
  const [ownedNFTsResult] = useAtom(ownedNFTsResultAtom);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [enteredNFTResponse, setEnteredNFTResponse] = useAtom(
    enteredNFTResponseAtom
  );

  const [, updateEnteredNFT] = useAtom(runFetchEnteredNFTResponseAtom);

  useEffect(() => {
    updateEnteredNFT();
  }, [signer]);

  useEffect(() => {
    console.log("EnteredNFTResponse", enteredNFTResponse);
  }, [enteredNFTResponse]);

  return (
    <Box {...props}>
      <SelectionModal
        raffle={raffle}
        tokenId={tokenId}
        setTokenId={setTokenId}
        signer={signer}
        setEnteredNFT={(tokenId: string) =>
          setEnteredNFTResponse({ data: tokenId, error: null, loading: false })
        }
      />
      {!signer && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ mb: 1 }}>Enter the Raffle...</Typography>
          <ConnectWallet variant="contained" />
        </Box>
      )}
      {signer && (
        <Box className="connected-content">
          {ownedNFTsResult.loading && <CircularProgress />}
          {!ownedNFTsResult.loading && ownedNFTsResult.data && (
            <>
              {ownedNFTsResult.data.length === 0 && (
                <>
                  <Typography
                    variant="h3"
                    className="purchase-prompt"
                    sx={{ mb: 4, fontSize: "2rem" }}
                  >
                    You currently don't own any apes, <b>pick one up</b> join
                    the raffle!
                  </Typography>
                  <Button
                    href={openseaLink}
                    variant="contained"
                    startIcon={<OpenseaIcon />}
                    sx={{ py: 1.8, px: 3 }}
                  >
                    Buy on Opensea
                  </Button>
                </>
              )}
              {ownedNFTsResult.data.length > 0 && (
                <>
                  {enteredNFTResponse.loading && "Checking Entry Status..."}
                  {!enteredNFTResponse.loading && !enteredNFTResponse.error && (
                    <>
                      {enteredNFTResponse.data && (
                        <Box sx={{ mb: 6 }}>
                          <Typography
                            variant="h4"
                            align="center"
                            sx={{ mb: 1 }}
                          >
                            You're In 🎫
                          </Typography>
                          <EnteredNFT tokenId={enteredNFTResponse.data} />
                        </Box>
                      )}
                      {!enteredNFTResponse.data && (
                        <Box className="selection-content">
                          <Typography align="center" sx={{ mb: 4 }}>
                            No NFT Entered.
                          </Typography>
                          <Typography
                            align="center"
                            variant="h5"
                            sx={{ mb: 4 }}
                          >
                            <b>Select an NFT</b> from your wallet to join the
                            raffle.
                          </Typography>
                          <OwnedNFTsSelection
                            ownedNFTs={ownedNFTsResult.data}
                            setTokenId={setTokenId}
                          />
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
})`
  .connected-content {
    display: grid;
    place-items: center;
  }

  .selection-content {
    width: 100%;
  }

  .purchase-prompt {
    b {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  h5 {
    b {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

export default RaffleSelection;
