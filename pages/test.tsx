import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import axios from "axios";

import formatRes from "@utils/formatRes";

import { Raffle, Entry } from "@utils/raffleServerAPI";
import {
  fetchLatestRaffle,
  createRaffle,
  archiveRaffle,
  createRaffleEntry,
} from "@utils/raffleClientAPI";

import TestAsyncCallback from "@components/TestAsyncCallback";

//* =============== DEFINITIONS ===============

const LatestRaffle = styled(({ ...props }) => {
  return (
    <TestAsyncCallback
      label="Fetch Latest Raffle"
      callback={() => fetchLatestRaffle(true)}
      {...props}
    />
  );
})``;

const CreateRaffle = styled(({ raffle, ...props }: { raffle: Raffle }) => {
  return (
    <TestAsyncCallback
      label="Create Raffle"
      //@ts-ignore
      callback={async () => createRaffle(raffle)}
      {...props}
    />
  );
})``;

const ArchiveRaffle = styled((props) => {
  return (
    <TestAsyncCallback
      label="Archive Raffle"
      callback={async () =>
        archiveRaffle("3ec14047-55a2-4a36-a048-d968349363a8")
      }
    />
  );
})``;

const createRaffleEntryProps: Entry = {
  walletAddress: "0xabcd",
  tokenId: "7",
  isWinner: false,
};

const CreateRaffleEntry = styled((props) => {
  return (
    <TestAsyncCallback
      label="Create Entry"
      callback={() =>
        createRaffleEntry(
          "5901da80-a3f6-4086-a7e9-0355f7d4029e",
          createRaffleEntryProps
        )
      }
      {...props}
    />
  );
})``;

//* =============== EXECUTION ===============

const createRaffleProperties: Raffle = {
  name: "TEST RAFFLE",
  description: "This is a test raffle, it's awesome!",
  startDate: new Date(2022, 2, 22, 12, 5, 10),
  endDate: new Date(2022, 2, 25, 18, 36, 40),
  numWinners: 3,
};

const test = styled((props) => {
  return (
    <Box {...props}>
      <LatestRaffle />
      <CreateRaffle raffle={createRaffleProperties} />
      <ArchiveRaffle />
      <CreateRaffleEntry />
    </Box>
  );
})`
  height: 100vh;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default test;
