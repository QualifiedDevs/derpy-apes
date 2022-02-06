import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { isClient } from "@utils";

const providerOptions = {

  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "34fbd7dbc3fa4d2cb3afbb1fb7f73197",
    },
  },
};

//* Whenever web3Modal.connect() is called, opens modal or wallet connect depending on if an injected wallet is detected
export const web3Modal = isClient() ? new Web3Modal({ providerOptions }) : null;