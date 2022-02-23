import React, { useState, useEffect, useMemo } from "react";

import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import Image from "next/image";

import type {Entry} from "@utils/raffleServerAPI"

import { contractAtom } from "@src/global/mintContract";
import { useAtom } from "jotai";

import { getTokenImageURI } from "@utils/tokenMetadata";

const RaffleEntry = styled(({account, tokenId, ...props }: {account: string, tokenId: string}) => {
  const [imageURI, setImageURI] = useState<string>("/mockups/1.png");

  const [contract] = useAtom(contractAtom);

  useMemo(() => {
    (async () => {
      const imageURI = await getTokenImageURI(tokenId, contract);
      setImageURI(imageURI);
    })();
  }, []);

  return (
    <Box {...props}>
      <Image src={imageURI} width={32} height={32} />
      <Typography>{account}</Typography>
    </Box>
  );
})`
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  span > * {
    border-radius: 100%;
  }

  p {
    margin-left: 0.5em;
    font-size: 1em;
  }
`;

// * Split evenly across columns. Num of columns grows/shrinks with the page.
// * Maybe number of columns also depends on raffle entries?
const RaffleGrid = styled(({ entries, ...props }: {entries: Entry[]}) => {
  const raffleEntries = useMemo(() => {
    return entries.map((entry: Entry) => (
        <RaffleEntry
          account={entry.walletAddress}
          tokenId={entry.tokenId}
          key={entry.walletAddress}
        />
      )
    );
  }, [entries]);

  return <Box {...props}>{raffleEntries}</Box>;
})`
  width: 100%;
  display: grid;

  grid-template-columns: 1fr;
  place-items: center;
  grid-gap: 1em;

  ${({ theme }) => theme.breakpoints.up("sm")} {
  }

  ${({ theme }) => theme.breakpoints.up("md")} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${({ theme }) => theme.breakpoints.up("lg")} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${({ theme }) => theme.breakpoints.up("xl")} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// * Only displays if there are leftovers clipped out the page.
const RaffleExcess = styled(({ quantity, ...props }: any) => {
  return <Typography {...props}>and {quantity} more derps...</Typography>;
})`
  font-size: 0.8em;
  color: ${({ theme }) => theme.palette.primary.main};

  ${({ quantity }) => quantity === 0 && "display: none;"}
`;

// * Receives wallet/nftURI keypairs from parent, along with the separate held NFT (if it exists)
const RaffleEntries = styled(({ entries, ...props }: {entries: Entry[]}) => {
  //TODO: The first entry of the first column should be the wallet's staked ape, if it exists.
  //TODO: Clip excess

  const [excessQuantity, setExcessQuantity] = useState(2);

  return (
    <Box {...props}>
      {entries.length === 0 && "No entries yet!"}
      <RaffleGrid entries={entries} sx={{ mb: 2 }} />
      {/* <RaffleExcess
        quantity={excessQuantity}
        className="excess-quantity"
        sx={{ mt: 4, mb: 2 }}
      /> */}
    </Box>
  );
})`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default RaffleEntries;
