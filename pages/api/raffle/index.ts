import { NextApiRequest, NextApiResponse } from "next";

import formatRes from "@utils/formatRes";

import { fetchRaffles, createRaffle } from "@utils/raffleServerAPI";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { includeEntries } = req.query;
  console.log("Include Entries:", includeEntries, typeof includeEntries)
  const { raffleProperties } = req.body?.data || {};
  switch (req.method) {
    case "GET":
      //* FETCH RAFFLES
      console.log("Fetching raffle summaries...");
      const [raffles, fetchRafflesErr] = await formatRes(fetchRaffles(includeEntries));
      if (fetchRafflesErr) {
        const msg = "Failed to fetch raffles";
        console.error(msg, fetchRafflesErr);
        res.status(500).send(msg);
      }
      res.status(200).send(raffles);
      //TODO: FETCH RAFFLES INCLUDING ENTRIES
      break;
    case "POST":
      //* CREATE RAFFLE
      console.log("Creating raffle...");
      const [raffle, createRaffleErr] = await formatRes(
        createRaffle(raffleProperties)
      );
      if (createRaffleErr) {
        const msg = `Failed to create raffle with properties ${raffleProperties}`;
        console.error(msg, createRaffleErr);
        res.status(500).send(msg);
        return;
      }
      res.status(200).send(raffle);
      break;
    case "PUT":
      break;
    case "PATCH":
      break;
    case "DELETE":
      break;
  }
}
