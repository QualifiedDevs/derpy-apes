import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import isClient from "@utils/isClient";
import config from "config.json";

const providerOptions = {
  /* See Provider Options Section */
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    },
  },
};

export default isClient
  ? new Web3Modal({
      network: config.network, // optional
      cacheProvider: true, // optional
      providerOptions, // required
    })
  : null;