//TODO: Adjust for rate limiting.

/*
  Every request should be added to a queue instead of being made immediately.
  The queue callback will return
*/

import notion from "@utils/notionClient";

export type Entry = {
  entryId?: string;
  walletAddress: string;
  tokenId: string;
  isWinner: boolean;
};

export interface SerializedEntry extends Entry {}

export interface Raffle {
  id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  numWinners: number;
  description: string;
  entries?: Entry[];
}

export interface SerializedRaffle {
  id?: string;
  name: string;
  startDateISO: string;
  endDateISO: string;
  numWinners: number;
  description: string;
  entries?: Entry[];
}

const rafflesId = process.env.NOTION_RAFFLES_ID!;

import formatRes from "@utils/formatRes";

export function serializeRaffle(raffle: Raffle) {
  //? raffleID?

  const sRaffle: SerializedRaffle = {
    ...raffle,
    startDateISO: raffle.startDate.toISOString(),
    endDateISO: raffle.endDate.toISOString(),
  };

  return sRaffle;
}

export function deserializeRaffle(sRaffle: SerializedRaffle) {
  //? raffleID?

  const raffle: Raffle = {
    ...sRaffle,
    startDate: new Date(sRaffle.startDateISO),
    endDate: new Date(sRaffle.endDateISO),
  };

  return raffle;
}

export function serializeEntry(entry: Entry) {
  const sEntry: SerializedEntry = { ...entry };
  return sEntry;
}

export function deserializeEntry(sEntry: SerializedEntry) {
  const entry: Entry = { ...sEntry };
  return entry;
}

export function formatRaffleResponse(raffleRes: any, serialized: boolean) {
  const sRaffle: SerializedRaffle & { id: string } = {
    id: raffleRes.id,
    name: raffleRes.properties.Name.title[0].plain_text,
    startDateISO: raffleRes.properties.Span.date.start,
    endDateISO: raffleRes.properties.Span.date.end,
    numWinners: raffleRes.properties.numWinners.number,
    description: raffleRes.properties.Description.rich_text[0].text.content,
  };

  return serialized
    ? sRaffle
    : (deserializeRaffle(sRaffle) as Raffle & { id: string });
}

export function formatRaffleResponses(raffles: any[], serialized: boolean) {
  return raffles.map((raffle) => formatRaffleResponse(raffle, serialized));
}

export function formatEntry(entryData: any, serialized: boolean) {
  const sEntry: SerializedEntry = {
    entryId: entryData.id,
    walletAddress: entryData.properties.Wallet.rich_text[0].text.content,
    tokenId: entryData.properties.NFT.rich_text[0].text.content,
    isWinner: entryData.properties.isWinner.checkbox,
  };

  return serialized ? sEntry : deserializeEntry(sEntry);
}

export function formatEntries(entries: any[], serialized: boolean) {
  return entries.map((entry) => formatEntry(entry, serialized));
}

export async function fetchRaffles(includeEntries?: boolean) {
  //TODO: includeEntries

  const [data, err] = await formatRes(
    notion.databases.query({ database_id: rafflesId })
  );
  if (err) throw err;
  const raffles = data.results;

  return formatRaffleResponses(raffles, true);
}

export async function fetchRaffle(raffleId: string, includeEntries?: boolean) {
  const [data, err] = await formatRes(
    notion.pages.retrieve({
      page_id: raffleId,
    })
  );
  if (err) throw err;
  const raffle = data;

  let entries: Entry[] | undefined;
  if (includeEntries) {
    const [data, err] = await formatRes(fetchRaffleEntries(raffleId));
    if (err) throw err;
    entries = data;
  }

  const formattedRaffle = formatRaffleResponse(raffle, true);
  formattedRaffle.entries = entries; //! Why???
  return formattedRaffle;
}

export async function fetchLatestRaffle(includeEntries?: boolean) {
  const [data, err] = await formatRes(
    notion.databases.query({
      database_id: rafflesId,
      sorts: [{ property: "Span", direction: "descending" }],
      page_size: 1,
    })
  );
  if (err) throw err;
  const raffle = data.results[0];

  let entries: Entry[] | undefined;
  if (includeEntries) {
    const [data, err] = await formatRes(fetchRaffleEntries(raffle.id));
    if (err) throw err;
    entries = data;
  }

  const formattedRaffle = formatRaffleResponse(raffle, true);

  formattedRaffle.entries = entries;
  return formattedRaffle;
}

export async function createRaffle(sRaffle: SerializedRaffle) {
  //TODO: IMPLEMENT AUTH

  const [newRaffle, newRaffleErr] = await formatRes(
    notion.pages.create({
      parent: {
        database_id: rafflesId,
      },
      properties: {
        Name: {
          title: [
            {
              type: "text",
              text: {
                content: sRaffle.name,
              },
            },
          ],
        },
        numWinners: {
          number: sRaffle.numWinners as number,
        },
        Description: {
          rich_text: [
            {
              type: "text",
              text: {
                content: sRaffle.description,
              },
            },
          ],
        },
        Span: {
          date: {
            start: sRaffle.startDateISO,
            end: sRaffle.endDateISO,
          },
        },
      },
    })
  );
  if (newRaffleErr) throw newRaffleErr;

  const [entries, entriesErr] = await formatRes(
    notion.databases.create({
      parent: { page_id: newRaffle.id },
      title: [
        {
          type: "text",
          text: {
            content: "Entries",
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Wallet: {
          rich_text: {},
        },
        NFT: {
          rich_text: {},
        },
        isWinner: {
          checkbox: {},
        },
      },
    })
  );
  if (entriesErr) return null;

  return formatRaffleResponse(newRaffle, false);
}

async function fetchRaffleEntriesId(raffleId: string) {
  const [data, err] = await formatRes(
    notion.blocks.children.list({
      block_id: raffleId,
      page_size: 1,
    })
  );
  if (err) throw err;

  const entriesId = data.results[0].id;
  return entriesId;
}

export async function fetchRaffleEntries(
  raffleId: string,
  maxResults?: number
) {
  const [fetchEntriesIdData, fetchEntriesIdErr] = await formatRes(
    fetchRaffleEntriesId(raffleId)
  );
  if (fetchEntriesIdErr) throw fetchEntriesIdErr;

  const entriesId = fetchEntriesIdData;

  const [fetchEntriesData, fetchEntriesErr] = await formatRes(
    notion.databases.query({
      database_id: entriesId,
    })
  );
  if (fetchEntriesErr) throw fetchEntriesErr;

  const entries = fetchEntriesData.results;

  return formatEntries(entries, false);
}

export async function fetchWinningEntries(raffleId: string) {
  const [fetchEntriesIdData, fetchEntriesIdErr] = await formatRes(
    fetchRaffleEntriesId(raffleId)
  );
  if (fetchEntriesIdErr) throw fetchEntriesIdErr;

  const entriesId = fetchEntriesIdData;

  const [queryWinningEntriesData, queryWinningEntriesErr] = await formatRes(
    notion.databases.query({
      database_id: entriesId,
      filter: {
        property: "isWinner",
        checkbox: { equals: true },
      },
    })
  );
  if (queryWinningEntriesErr) throw queryWinningEntriesErr;

  const winningEntries = queryWinningEntriesData.results;
  return formatEntries(winningEntries, false);
}

export async function updateRaffle(raffleId: string, options: Raffle) {
  //TODO: IMPLEMENT AUTH

  //TODO: IMPLEMENT
  const [data, err] = await formatRes(
    notion.pages.update({
      page_id: raffleId,
      properties: {
        //! UPDATE PROPERTIES... PROPERLY!
        Name: options.name,
        Span: "",
        numWinners: options.numWinners,
        Description: options.description,
      },
    })
  );
}

export async function updateWinningEntries(
  raffleId: string,
  numWinners: number
) {
  //TODO: IMPLEMENT
  //TODO: IMPLEMENT AUTH
}

export async function clearWinners(raffleId: string) {
  //TODO: IMPLEMENT
  //TODO: IMPLEMENT AUTH
}

export async function archiveRaffle(raffleId: string) {
  //TODO: IMPLEMENT AUTH

  const [data, err] = await formatRes(
    notion.pages.update({ page_id: raffleId, archived: true })
  );
  if (err) throw err;
  return data;
}

export async function createRaffleEntry(raffleId: string, options: Entry) {
  //TODO: IMPLEMENT AUTH

  //! So the page isn't a database?
  //! Of course!

  const [entriesIdData, entriesIdErr] = await formatRes(
    fetchRaffleEntriesId(raffleId)
  );
  if (entriesIdErr) throw entriesIdData;
  const entriesId = entriesIdData;

  const [data, err] = await formatRes(
    notion.pages.create({
      parent: { database_id: entriesId },
      properties: {
        Wallet: {
          rich_text: [
            {
              text: { content: options.walletAddress },
            },
          ],
        },
        NFT: {
          rich_text: [
            {
              text: { content: options.tokenId },
            },
          ],
        },
        isWinner: { checkbox: options.isWinner || false },
      },
    })
  );
  if (err) throw err;

  const entry = data;

  return formatEntry(entry, false);
}

export async function fetchRaffleEntry(entryId: string) {
  const [data, err] = await formatRes(
    notion.pages.retrieve({
      page_id: entryId,
    })
  );
  if (err) throw err;
  const entry = data;
  return formatEntry(entry, false);
}

//TODO: Partial
export async function updateRaffleEntry(entryId: string, entry: Entry) {
  //TODO: IMPLEMENT AUTH

  //TODO: IMPLEMENT
  const [data, err] = await formatRes(
    notion.pages.update({
      page_id: entryId,
      properties: {
        Wallet: { rich_text: [{ text: { content: entry.walletAddress } }] },
        NFT: { rich_text: [{ text: { content: entry.tokenId } }] },
        isWinner: { checkbox: entry.isWinner },
      },
    })
  );
  if (err) throw err;

  return data;
}

export async function archiveRaffleEntry(entry_id: string) {
  //TODO: IMPLEMENT AUTH

  const [data, err] = await formatRes(
    notion.blocks.delete({
      block_id: entry_id,
    })
  );
  if (err) throw err;
  return data;
}

export async function fetchRaffleEntryByWalletAddress(
  raffleId: string,
  address: string
) {

  const [entriesIdData, entriesIdErr] = await formatRes(fetchRaffleEntriesId(raffleId));
  if (entriesIdErr) throw entriesIdErr;
  const entriesId = entriesIdData;

  const [data, err] = await formatRes(
    notion.databases.query({
      database_id: entriesId,
      filter: { property: "Wallet", rich_text: { equals: address } },
    })
  );
  if (err) throw err;
  const entry = data.results[0];

  return entry? formatEntry(entry, true) : null;
}

export async function fetchRaffleEntryByTokenId(raffleId: string, nft: string) {

  const [entriesIdData, entriesIdErr] = await formatRes(fetchRaffleEntriesId(raffleId));
  if (entriesIdErr) throw entriesIdErr;
  const entriesId = entriesIdData;

  const [data, err] = await formatRes(
    notion.databases.query({
      database_id: entriesId,
      filter: { property: "NFT", rich_text: { equals: nft } },
    })
  );
  if (err) throw err;
  const entry = data.results[0];
  return formatEntry(entry, true);
}
