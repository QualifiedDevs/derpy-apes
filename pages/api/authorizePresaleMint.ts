//@ts-nocheck

import * as fs from "fs";
import { sign } from "@utils";

import type { NextApiRequest, NextApiResponse } from "next";

export type AuthData = {
  hash: string;
  signature: string;
};

export enum authStage {
  FREE_MINT = 0,
  PRESALE,
}

import mintContractMetadata from "@src/artifacts/mintContract/metadata"

const privateKeys: string[] = [
  process.env.FREE_MINT_PRIVATE_KEY,
  process.env.PRESALE_AUTH_PRIVATE_KEY,
];

import freeMintWhitelist from "@src/freeMintWhitelist.json";
import presaleWhitelist from "@src/presaleWhitelist.json";

const whitelists: object[] = [freeMintWhitelist, presaleWhitelist];

async function authorizePresaleMint(
  req: NextApiRequest,
  res: NextApiResponse<AuthData | string>
) {

  const { account, stage } = req.query;

  const privateKey = privateKeys[stage];
  const whitelist = whitelists[stage];

  console.log(`Auth for stage ${stage} from account ${account}`);

  if (!whitelist[account])
    return res.status(403).send("Account Not on Whitelist");

  const message: AuthData = await sign(privateKey, mintContractMetadata.address, account);

  res.status(200).json(message);
}

export default authorizePresaleMint;

/*
    I should query this API:
    -Whenever the user connects their wallet
    -Whenever the connected wallet address changes
*/
