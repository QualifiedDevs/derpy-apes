//@ts-nocheck

import Web3 from "web3";
import { sign } from "@utils";

import type { NextApiRequest, NextApiResponse } from "next";

import mintAbi from "@src/artifacts/mintContract/abi"
import mintContractMetadata from "@src/artifacts/mintContract/metadata"

export type AuthData = {
  hash: string;
  signature: string;
};

export enum authStage {
  FREE_MINT = 0,
  PRESALE,
}

const privateKeys: string[] = [
  process.env.FREE_MINT_AUTH_PRIVATE_KEY,
  process.env.PRESALE_AUTH_PRIVATE_KEY,
];

import whitelist from "@src/presaleWhitelist.json";

const readonlyWeb3 = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
  )
);

const readonlyMintContract = new readonlyWeb3.eth.Contract(
  mintAbi,
  mintContractMetadata.address
);



async function authorizePresaleMint(
  req: NextApiRequest,
  res: NextApiResponse<AuthData | string>
) {

  const { account, stage } = req.query;

  const privateKey = privateKeys[stage];

  console.log(`Auth requested for stage ${stage} from account ${account}`);

  if (stage === authStage.FREE_MINT) {

    //! Get availableFreeMint from Contract
    const checkRes = await readonlyMintContract.methods.availableFreeMint(1, account).call();
    if (!checkRes)
      return res.status(403).send({error: "Account Not on Whitelist"});
  } else {
    console.log("CHECKING PRESALE")
    if (!whitelist[account])
      return res.status(403).send({error: "Account Not on Whitelist"});
  }

  console.log("made it...")

  console.log("signing...")

  const message: AuthData = await sign(
    privateKey,
    mintContractMetadata.address,
    account
  );

  console.log("message", message)

  res.status(200).json(message);
}

export default authorizePresaleMint;

/*
    I should query this API:
    -Whenever the user connects their wallet
    -Whenever the connected wallet address changes
*/