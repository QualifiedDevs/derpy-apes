import { ethers } from "ethers";
import config from "config.json"

const provider = ethers.getDefaultProvider(config.network, {
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    infura: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    pocket: process.env.NEXT_PUBLIC_POCKET_API_KEY,

    // * The number of backends that must agree (default: 2 for mainnet, 1 for testnets)
    quorum: undefined,
});

export default provider;