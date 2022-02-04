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

  const privateKey = "0f09255293bc2c863624308b2859fac27df56529e415431ef38b0a4539ffc8b4";

  console.log(`Auth requested for stage ${stage} from account ${account}`);

  if (stage.toString() === "0") {
    //! Get availableFreeMint from Contract
    console.log("CHECKING FREE MINT");
    const checkRes = await readonlyMintContract.methods.avaliableFreeMint(2, account).call();
    if (!checkRes)
      return res.status(403).send({error: "Account Not on Whitelist"});
  } else {
    console.log("CHECKING PRESALE")
    if (!whitelist[account])
      return res.status(403).send({error: "Account Not on Whitelist"});
  }

  console.log(privateKey, mintContractMetadata.address, account)

  const message: AuthData = await sign(
    privateKey,
    mintContractMetadata.address,
    account
  );

  res.status(200).json(message);
}

export default authorizePresaleMint;

/*
    I should query this API:
    -Whenever the user connects their wallet
    -Whenever the connected wallet address changes
*/