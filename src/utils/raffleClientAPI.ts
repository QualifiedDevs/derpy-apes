import type { Signature } from "ethers";
import axios from "axios";
const raffleAPI = axios.create({
  baseURL: "/api/raffle",
});
import type { Entry, Raffle, SerializedRaffle } from "@utils/raffleServerAPI";
import { serializeRaffle, deserializeRaffle } from "@utils/raffleServerAPI";

import formatRes from "@utils/formatRes";

//* QUERY

export async function fetchRaffles(includeEntries?: boolean) {
  const [data, err]: [SerializedRaffle & { raffleId: string }[], any] =
    await formatRes(
      raffleAPI.get("/", {
        params: {
          includeEntries,
        },
      })
    );
  if (err) console.error(err);

  const sRaffle = data;

  return deserializeRaffle(sRaffle);
}

export async function fetchRaffle(raffleId: string, includeEntries?: boolean) {
  const [data, err]: [SerializedRaffle & { raffleId: string }, any] =
    await formatRes(
      raffleAPI.get(`/${raffleId}`, {
        params: {
          includeEntries,
        },
      })
    );
  if (err) console.error(err);
  const sRaffle = data;
  return deserializeRaffle(sRaffle);
}

export async function fetchLatestRaffle(includeEntries?: boolean) {
  const [data, err]: [SerializedRaffle & { raffleId: string }, any] =
    await formatRes(
      raffleAPI.get("/latest", {
        params: {
          includeEntries,
        },
      })
    );
  if (err) console.error(err);
  const sRaffle = data;
  return deserializeRaffle(sRaffle);
}

export async function createRaffle(raffle: Raffle, signature: Signature) {
  //TODO: IMPLEMENT AUTH

  const raffleProperties = serializeRaffle(raffle);

  const [data, err] = await formatRes(
    raffleAPI.post("/", {
      data: {
        raffleProperties,
      },
    })
  );
  if (err) console.error(err);
  return data;
}

// TODO: EXCLUDE ID (Change base class structure and extend where necessary?)
export async function updateRaffle(
  raffleId: string,
  raffleProperties: Partial<Raffle>
) {
  //TODO: IMPLEMENT AUTH

  const [data, err] = await formatRes(
    raffleAPI.patch(`/${raffleId}`, {
      data: {
        raffleProperties,
      },
    })
  );
  if (err) console.error(err);
  return data;
}

export async function archiveRaffle(raffleId: string) {
  //TODO: IMPLEMENT AUTH

  const [data, err] = await formatRes(raffleAPI.delete(`/${raffleId}`));
  if (err) console.error(err);
  return data;
}

export async function createRaffleEntry(raffleId: string, entry: Entry) {
  //TODO: IMPLEMENT AUTH

  const { walletAddress, tokenId } = entry;

  const [data, err] = await formatRes(
    raffleAPI.post(`/${raffleId}`, {
      data: {
        entryProperties: entry,
      },
    })
  );
  if (err) console.error(err);
  return data;
}

export async function fetchRaffleEntry(entryId: string) {
  //TODO: IMPLEMENT

  const [data, err] = await formatRes(raffleAPI.delete(`/entry/${entryId}`));
  if (err) console.error(err);
  return data;
}

export async function updateRaffleEntry(entryId: string, entry: Entry) {
  //TODO: IMPLEMENT

  //TODO: IMPLEMENT AUTH
}

export async function archiveRaffleEntry(raffleId: string, entryId: string) {
  //TODO: IMPLEMENT AUTH

  const [data, err] = await formatRes(
    raffleAPI.delete(`/${raffleId}/${entryId}`)
  );
  if (err) console.error(err);
  return data;
}

export async function fetchRaffleEntryByWalletAddress(
  raffleId: string,
  address: string
) {
  const [data, err] = await formatRes(
    raffleAPI.get(`/${raffleId}`, { params: { walletAddress: address } })
  );
  if (err) console.error(err);
  return data as Entry;
}

export async function fetchRafflyEntryByTokenId(
  raffleId: string,
  tokenId: string
) {
  const [data, err] = await formatRes(
    raffleAPI.get(`/${raffleId}`, { params: { tokenId } })
  );
  if (err) console.error(err);
  return data as Entry;
}
