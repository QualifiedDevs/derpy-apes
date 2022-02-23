import React, { useMemo } from "react";

import { styled } from "@mui/material/styles";
import { Box, Typography, Container } from "@mui/material";

//! Don't do a raffle login, instead make them connect.
//! I will integrate it in the RaffleSelection UI
//! Approaching, Selection, and Results are based on the dates of the most recent raffle in the database (by start time).

import type { GetStaticProps } from "next";
import type { Raffle, SerializedRaffle, Entry } from "@utils/raffleServerAPI";
import { fetchLatestRaffle, deserializeRaffle } from "@utils/raffleServerAPI";
import { fetchRaffleEntryByWalletAddress } from "@utils/raffleClientAPI";
import { requestSignatureAuth } from "@utils/auth";

import RaffleApproaching from "@components/RaffleApproaching";
import RaffleSelection from "@components/RaffleSelection";
import RaffleResults from "@components/RaffleResults";

import RaffleEntries from "@components/RaffleEntries";

import formatRes from "@utils/formatRes";

import { useAtom } from "jotai";
import { latestRaffleResponseAtom } from "@src/global/raffle";

const RaffleStatus = styled(
  ({ start, end, ...props }: { start: Date; end: Date }) => {
    return (
      <Box {...props}>
        <Typography
          align="center"
          sx={{ mb: 0.5, fontSize: ".8em" }}
          className="dates"
        >
          {start.toDateString()} - {end.toDateString()}
        </Typography>
        <Typography className="raffle-started" align="center">
          Raffle Started
        </Typography>
      </Box>
    );
  }
)`
  display: flex;
  flex-direction: column;
  align-items: center;

  .dates {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .raffle-started {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 600;
  }
`;

const current = styled(
  ({ sLatestRaffle, ...props }: { sLatestRaffle: SerializedRaffle }) => {
    const [latestRaffleResponse, setLatestRaffleResponse] = useAtom(
      latestRaffleResponseAtom
    );

    const latestRaffle = useMemo(() => {
      const raffle = deserializeRaffle(sLatestRaffle);
      //@ts-ignore
      setLatestRaffleResponse({ data: raffle, err: null, loading: false });
      return raffle;
    }, [sLatestRaffle]);

    return (
      <Box {...props}>
        <Box className="raffle-info" sx={{ mb: 6 }}>
          <RaffleStatus
            start={latestRaffle.startDate}
            end={latestRaffle.endDate}
            sx={{ mb: 3 }}
          />
          <Typography variant="h2" align="center" sx={{ mb: 2 }}>
            Random Chimp Event
          </Typography>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Who will win?
          </Typography>
          <RaffleSelection raffle={latestRaffle} />
        </Box>
        <Container maxWidth="xl">
          <Typography
            className="wallets-entered"
            variant="h4"
            align="center"
            sx={{ mb: 4 }}
          >
            Wallets Entered:
          </Typography>
          <RaffleEntries entries={latestRaffle.entries!} />
        </Container>
      </Box>
    );
  }
)`
  margin-top: 10rem;
  margin-bottom: 10rem;

  .wallets-entered {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 600;
  }

  .raffle-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      text-transform: uppercase;
      font-weight: 400;
    }

    h4 {
      text-transform: uppercase;
      font-weight: 300;
    }
  }
`;

export default current;

export const getStaticProps: GetStaticProps = async () => {
  const [data, err] = await formatRes(fetchLatestRaffle(true));
  if (err) console.error("Failed to refresh latest raffle.");
  const sLatestRaffle = data;

  return {
    props: { sLatestRaffle },
    revalidate: 10000,
  };
};
