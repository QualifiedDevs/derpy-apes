// Let's think of all of our functions...
// I also need to say whether a raffle is active or not.
// No I should just check for the upcoming and last raffle.

//TODO: Adjust for rate limiting

import notion from "@utils/notionClient";

const raffles_id = process.env.NOTION_RAFFLES_ID!;

export type Raffle = {
  startDate: Date;
  endDate: Date;
  numWinners: number;
  description: string;
};

export async function getRaffles() {
  let res = null;
  try {
    res = await notion.databases.query({ database_id: raffles_id });
    const raffles = res.results;
    return raffles;
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function getLatestRaffle() {
  let res = null;
  try {
    res = await notion.databases.query({
      database_id: raffles_id,
      sorts: [{ property: "Span", direction: "descending" }],
      page_size: 1,
    });
    const raffle = res.results[0];
    return raffle;
  } catch (err) {
    console.error(err);
  }
  return res;
}

//! Could this return a single page versus an array if there is only one raffle?
export async function getRaffleEntries(raffle_id: string, maxResults?: number) {
  let res = null;
  try {
    res = await notion.databases.query({
      database_id: raffle_id,
      page_size: maxResults,
    });
    const raffles = res.results;
    return raffles;
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function getWinners(raffle_id: string) {
  let res = null;
  try {
    res = await notion.databases.query({
      database_id: raffle_id,
      filter: { property: "isWinner", checkbox: { equals: true } },
    });
    const winners = res.results;
    return winners;
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function chooseWinners(raffle_id: string, numWinners: number) {
  const entries = await getRaffleEntries(raffle_id);
  if (entries.length < numWinners) {
    console.log("Less entrants than max winners. Everybody wins!");
  }

  //TODO: If there are already winners, throw an error!
  //TODO: If there are less entrants than numWinners, everybody wins!
  //TODO: Generate x random indexes with no repeats.
  //TODO: Begin asynchronous update requests for all pages... Cant this just be one request?
}

export async function clearWinners(raffle_id: string) {
  //TODO: get all winners, remove their silly properties.
}

//! I guess there are TWO pages AND a database that need to be created.
export async function createRaffle(raffle_id: string, options: any) {
  //* Options looks like:
  // startDate (Date)
  // endDate (Date)
  // numWinners (num)
  // Description (string)

  let res = null;
  try {
    let createPageRes = null;
    try {
      createPageRes = await notion.pages.create({
        parent: {
          database_id: raffles_id,
        },
        properties: {
          Name: options.title,
          //TODO: MAKE SPAN WORK FR
          Span: {
            start: options.startDate.toISOString(),
            end: options.endDate.toISOString(),
          },
          numWinners: options.numWinners,
          Description: options.desc,
        },
      });
    } catch (err) {
      throw err;
    }
    let createDatabaseRes = null;
    try {
      createDatabaseRes = await notion.databases.create({
        parent: { page_id: createPageRes.id },
        title: [{ type: "text", text: { content: "Entries" } }],
        properties: {
          Title: { type: "title", title: {} },
          Wallet: { type: "rich_text", rich_text: {} },
          NFT: { type: "rich_text", rich_text: {} },
          isWinner: { type: "checkbox", checkbox: {} },
        },
      });
    } catch (err) {
      throw err;
    }
    //TODO: Make database first block of parent page (Is this done for me?)
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function updateRaffle(raffle_id: string, options: any) {
  let res = null;
  try {
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function archiveRaffle(raffle_id: string) {
  let res = null;
  try {
    res = await notion.blocks.delete({ block_id: raffle_id });
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function createRaffleEntry(raffle_id: string) {
  let res = null;
  try {
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function updateRaffleEntry(entry_id: string, props: any) {
  let res = null;
  try {
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function archiveRaffleEntry(entry_id: string) {
  let res = null;
  try {
    res = await notion.blocks.delete({
      block_id: entry_id,
    });
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function getEntryFromWalletAddress(
  raffle_id: string,
  address: string
) {
  let res = null;
  try {
    res = await notion.databases.query({
      database_id: raffle_id,
      filter: { property: "Wallet", rich_text: { equals: address } },
    });
    const entry = res.results[0];
    return entry;
  } catch (err) {
    console.error(err);
  }
  return res;
}

export async function getEntryFromNFT(raffle_id: string, nft: string) {
  let res = null;
  try {
    res = await notion.databases.query({
      database_id: raffle_id,
      filter: { property: "NFT", rich_text: { equals: nft } },
    });
    const entry = res.results[0];
    return entry;
  } catch (err) {
    console.error(err);
  }
  return res;
}
