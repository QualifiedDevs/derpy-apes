import { NextApiRequest, NextApiResponse } from "next";

import formatRes from "@utils/formatRes";
import {
  fetchLatestRaffle,
  fetchRaffle,
  updateRaffle,
  archiveRaffle,
  fetchRaffleEntryByWalletAddress,
  fetchRaffleEntryByTokenId,
  createRaffleEntry,
} from "@utils/raffleServerAPI";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  //! Can request params be nul or undefined?
  const { raffleId, includeEntries, walletAddress, tokenId } = req.query as {[key: string]: string};
  const { raffleProperties, entryProperties } = req.body?.data || {};

  switch (req.method) {
    case "GET":
      if (walletAddress) {
        //* FETCH ENTRY BY WALLET ADDRESS
        console.log(
          `Fetching entry with wallet address ${walletAddress} from raffle with id ${raffleId}...`
        );
        const [fetchEntryByWalletData, fetchEntryByWalletErr] = await formatRes(
          fetchRaffleEntryByWalletAddress(raffleId, walletAddress)
        );
        if (fetchEntryByWalletErr) {
          const msg = `Failed to fetch entry with wallet address ${walletAddress} in raffle with id ${raffleId}`;
          console.error(msg, fetchEntryByWalletErr);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(fetchEntryByWalletData);
        return;
      }

      if (tokenId) {
        //* FETCH ENTRY BY TOKEN ID
        const [fetchEntryByTokenIdData, fetchEntryByTokenIdErr] =
          await formatRes(fetchRaffleEntryByTokenId(raffleId, tokenId));
        if (fetchEntryByTokenIdErr) {
          const msg = `Failed to fetch entry with tokenId ${tokenId} in raffle with id ${raffleId}`;
          console.error(msg, fetchEntryByTokenIdErr);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(fetchEntryByTokenIdData);
        return;
      }

      //* GET LATEST RAFFLE
      if (raffleId === "latest") {
        console.log("Fetching latest raffle...");
        //@ts-ignore
        const [data, err] = await formatRes(fetchLatestRaffle(includeEntries));
        if (err) {
          const msg = "Failed to fetch latest raffle";
          console.error(msg, err);
          res.status(500).send(msg);
          return;
        }
        res.status(200).send(data);
        return;
      }
      //* GET RAFFLE BY ID
      console.log(`Fetching raffle with id ${raffleId}`);
      const [fetchRaffleData, fetchRaffleErr] = await formatRes(
        //@ts-ignore
        fetchRaffle(raffleId, includeEntries)
      );
      if (fetchRaffleErr) {
        const msg = `Failed to fetch raffle of id ${raffleId}`;
        console.error(msg, fetchRaffleErr);
        res.status(500).send(msg);
      }
      res.status(200).send(fetchRaffleData);
      break;
    case "POST":
      //* CREATE ENTRY
      console.log(
        `Creating entry with properties: ${entryProperties} under raffle with id ${raffleId}...`
      );
      const [createRaffleEntryData, createRaffleEntryErr] = await formatRes(
        createRaffleEntry(raffleId, entryProperties)
      );
      if (createRaffleEntryErr) {
        const msg = `Failed to update raffle with id ${raffleId} with given properties: ${raffleProperties}`;
        console.error(msg, createRaffleEntryErr);
        res.status(500).send(msg);
        return;
      }
      res.status(200).send(createRaffleEntryData);
      break;
    case "PUT":
      break;
    case "PATCH":
      //* UPDATE RAFFLE
      console.log(`Updating raffle with id ${raffleId}...`);
      const [updateRaffleData, updateRaffleErr] = await formatRes(
        updateRaffle(raffleId, raffleProperties)
      );
      if (updateRaffleErr) {
        const msg = `Failed to update raffle with id ${raffleId} with given properties: ${raffleProperties}`;
        console.error(msg, updateRaffleErr);
        res.status(500).send(msg);
        return;
      }
      res.status(200).send(updateRaffleData);
      break;
    case "DELETE":
      //* ARCHIVE RAFFLE
      console.log(`Archiving raffle with id ${raffleId}...`);
      const [archiveRaffleData, archiveRaffleErr] = await formatRes(
        archiveRaffle(raffleId)
      );
      if (archiveRaffleErr) {
        const msg = `Failed to archive raffle with id ${raffleId}`;
        console.error(msg, archiveRaffleErr);
        res.status(500).send(msg);
        return;
      }
      res.status(200).send(archiveRaffleData);
      break;
  }
}
