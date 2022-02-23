import { NextApiRequest, NextApiResponse } from "next";

import {
  fetchRaffleEntry,
  updateRaffleEntry,
  archiveRaffleEntry,
} from "@utils/raffleServerAPI";

import formatRes from "@utils/formatRes";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { entryId } = req.query as {[key: string] : string};
  const { entryProperties } = req.body?.data || {};

  switch (req.method) {
    case "GET":
      // * FETCH ENTRY
      const [fetchRaffleEntryData, fetchRaffleEntryErr] = await formatRes(
        fetchRaffleEntry(entryId)
      );
      if (fetchRaffleEntryErr) {
        const msg = `Failed to fetch raffle entry with id ${entryId}`;
        console.error(msg, fetchRaffleEntryErr);
        res.status(500).send(msg);
      }
      res.status(200).send(fetchRaffleEntryData);

      break;
    case "POST":
      break;
    case "PUT":
      break;
    case "PATCH":
      // * UPDATE ENTRY
      console.log(
        `Updating entry with id ${entryId} with given properties: ${entryProperties}`
      );
      const [updateRaffleEntryData, updateRaffleEntryErr] = await formatRes(
        updateRaffleEntry(entryId, entryProperties)
      );
      if (updateRaffleEntryErr) {
        const msg = `Failed to update raffle entry with id ${entryId}`;
        console.error(msg, updateRaffleEntryErr);
        res.status(500).send(msg);
      }
      res.status(200).send(updateRaffleEntryData);
      break;
    case "DELETE":
      // * ARCHIVE ENTRY
      console.log(`Archiving entry with id ${entryId}...`);
      const [archiveRaffleEntryData, archiveRaffleEntryErr] = await formatRes(
        archiveRaffleEntry(entryId)
      );
      if (archiveRaffleEntryErr) {
        const msg = `Failed to archive raffle entry with id ${entryId}`;
        console.error(msg, archiveRaffleEntryErr);
        res.status(500).send(msg);
      }
      res.status(200).send(archiveRaffleEntryData);

      break;
  }
}
