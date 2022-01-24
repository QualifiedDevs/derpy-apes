//@ts-nocheck

import * as fs from "fs";
import { sign } from "@utils";

import type { NextApiRequest, NextApiResponse } from "next";

export type AuthData = {
  hash: string;
  signature: string;
};

const contractMetadata = JSON.parse(fs.readFileSync("./src/artifacts/mintContract/metadata.json", "utf-8"))
const contractAddress: string = contractMetadata.address;

const whitelist = JSON.parse(fs.readFileSync("./src/whitelist.json", "utf-8"));

const privateKey: string = process.env.AUTHORIZATION_PRIVATE_KEY!;

async function authorizePresaleMint(
  req: NextApiRequest,
  res: NextApiResponse<AuthData | string>
) {

    const account: string = req.query.account;

    console.log("Authorization Request from Account", account)

    if (!whitelist[account])
        return res.status(403).send("Account Not on Whitelist");

    const message: AuthData = await sign(privateKey, contractAddress, account)

  res.status(200).json(message);
}

export default authorizePresaleMint;

/*
    I should query this API:
    -Whenever the user connects their wallet
    -Whenever the connected wallet address changes
*/