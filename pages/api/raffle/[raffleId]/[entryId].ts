import { NextApiRequest, NextApiResponse } from "next";

import formatRes from "@utils/formatRes";
import {
  fetchRaffleEntries,
  fetchWinningEntries,
  updateWinningEntries,
} from "@utils/raffleServerAPI";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { raffleId, entryId } = req.query as { [key: string]: string };
  const { maxEntries, numWinners } = req.body?.data || {};

  switch (req.method) {
    case "GET":
      //* FETCH ALL ENTRIES IN RAFFLE
      if (entryId === "all") {
        console.log(`Fetching all entries in raffle with id ${raffleId}...`);
        const [fetchRaffleEntriesData, fetchRaffleEntriesErr] = await formatRes(
          fetchRaffleEntries(raffleId, parseInt(maxEntries))
        );
        if (fetchRaffleEntriesErr) {
          const msg = `Failed to fetch entries in raffle with id ${raffleId}`;
          console.error(msg, fetchRaffleEntriesErr);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(fetchRaffleEntriesData);
        return;
      }

      //* FETCH ALL WINNING ENTRIES IN RAFFLE
      if (entryId === "winners") {
        console.log(
          `Fetching all winning entries in raffle with id ${raffleId}...`
        );
        const [fetchWinningEntriesData, fetchWinningEntriesErr] =
          await formatRes(fetchWinningEntries(raffleId));
        if (fetchWinningEntriesErr) {
          const msg = `Failed to fetch winning entries in raffle with id ${raffleId}`;
          console.error(msg, fetchWinningEntriesErr);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(fetchWinningEntriesData);
        return;
      }

    case "POST":
      break;
    case "PUT":
      break;
    case "PATCH":
      //* UPDATE WINNING ENTRIES IN RAFFLE
      if (entryId === "winners") {
        console.log(
          `Fetching all winning entries in raffle with id ${raffleId}...`
        );
        const [updateWinningEntriesData, updateWinningEntriesErr] =
          await formatRes(updateWinningEntries(raffleId, parseInt(numWinners)));
        if (updateWinningEntriesErr) {
          const msg = `Failed to update winning entries in raffle with id ${raffleId}`;
          console.error(msg, updateWinningEntriesErr);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(updateWinningEntriesData);
        return;
      }
      break;
    case "DELETE":
      break;
  }
}
