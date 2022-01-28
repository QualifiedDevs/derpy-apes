//@ts-nocheck

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnect from "@walletconnect/web3-provider";

import { getMintAuth, isClient } from "@utils";

import type { AuthData } from "@api/authorizePresaleMint";

import mintAbi from "@src/artifacts/mintContract/abi.json";
import mintContractMetadata from "@src/artifacts/mintContract/metadata.json";
import looksAbi from "@src/artifacts/erc20Payable/abi.json";
import looksContractMetadata from "@src/artifacts/erc20Payable/metadata.json";

import { web3Modal } from "@utils/web3Modal";

import { authStage } from "@api/authorizePresaleMint";

export type Web3ContextValues = {
  web3?: Web3;

  //? Should this default to an empty array?
  connectedAccounts?: string[] | null;
  setConnectedAccounts?: React.Dispatch<string[] | null>;

  connected: boolean;
  setConnected?: React.Dispatch<boolean>;

  mintContract?: any;
  setMintContract?: React.Dispatch<any>;

  looksContract?: any;
  setLooksContract?: React.Dispatch<any>;

  provider?: any;
  setProvider?: React.Dispatch<any>;

  //? Should this have a default invalid chain value? e.g. -1?
  chainId?: number;
  setChainId?: React.Dispatch<number>;

  isMinting: boolean;
  setIsMinting?: React.Dispatch<boolean>;

  presaleWhitelistAuth?: AuthData | null;
  setPresaleWhitelistAuth?: React.Dispatch<AuthData | null>;

  freeMintWhitelistAuth?: AuthData | null;
  setFreeMintWhitelistAuth?: React.Dispatch<AuthData | null>;

  freeMintAvailable?: boolean;
  setFreeMintAvailable?: React.Dispatch<boolean>;

  isPresale?: boolean;
  setIsPreale?: React.Dispatch<boolean>;

  maxSupply?: number;
  setMaxSupply?: React.Dispatch<number>;

  totalSupply?: number;
  setTotalSupply?: React.Dispatch<number>;

  ethPrice?: number;
  setEthPrice?: number;

  looksPrice?: number;
  setLooksPrice?: React.Dispatch<number>;

  looksBalanceApproved?: number;
  setLooksBalanceApproved?: React.Dispatch<number>;

  accountNFTsMinted?: number;
  setAccountNFTsMinted?: React.Dispatch<number | undefined>;

  maxPerTxn?: number;
  setMaxPerTxn?: React.Dispatch<number>;
};

const defaultContext: Web3ContextValues = {
  connectedAccounts: null,
  connected: false,
  isMinting: false,
};

export const Web3Context = createContext(defaultContext);

// TODO: Clean up the provider connections and such
const web3 = new Web3("ws://localhost:8546");

// TODO: Type declarations for component props
export default function Web3Provider(props: any) {
  //* INITIALIZE GLOBAL & LOCAL STATE
  const [provider, setProvider] = useState(defaultContext.provider);
  const [mintContract, setMintContract] = useState(defaultContext.mintContract);
  const [looksContract, setLooksContract] = useState(
    defaultContext.looksContract
  );
  const [connected, setConnected] = useState(defaultContext.connected);
  const [chainId, setChainId] = useState(defaultContext.chainId);
  const [connectedAccounts, setConnectedAccounts] = useState(
    defaultContext.connectedAccounts
  );
  const [isMinting, setIsMinting] = useState(defaultContext.isMinting);
  const [presaleWhitelistAuth, setPresaleWhitelistAuth] = useState(
    defaultContext.presaleWhitelistAuth
  );
  const [freeMintWhitelistAuth, setFreeMintWhitelistAuth] = useState(
    defaultContext.freeMintWhitelistAuth
  );
  const [freeMintAvailable, setFreeMintAvailable] = useState(
    defaultContext.freeMintAvailable
  );
  const [isPresale, setIsPresale] = useState(defaultContext.isPresale);
  const [maxSupply, setMaxSupply] = useState(defaultContext.maxSupply);
  const [totalSupply, setTotalSupply] = useState(defaultContext.totalSupply);
  const [ethPrice, setEthPrice] = useState(defaultContext.ethPrice);
  const [looksPrice, setLooksPrice] = useState(defaultContext.looksPrice);
  const [accountNFTsMinted, setAccountNFTsMinted] = useState<
    number | undefined
  >(defaultContext.accountNFTsMinted);
  const [maxPerTxn, setMaxPerTxn] = useState<number>(defaultContext.maxPerTxn);
  const [looksBalanceApproved, setLooksBalanceApproved] = useState<number>(defaultContext.looksBalanceApproved)

  //* MIDDLEWARE FOR STATE CHANGES

  // useEffect(() => {
  //   if (!isClient()) return;
    
  // }, [])

  useEffect(() => {
    if (!isClient() || !provider) return;

    web3.setProvider(provider);

    setMintContract(
      new web3.eth.Contract(mintAbi, mintContractMetadata.address)
    );
    setLooksContract(
      new web3.eth.Contract(looksAbi, looksContractMetadata.address)
    );

    // TODO: Make sure this shit ain't broken!
    (async () => {
      const accounts = await web3.eth.getAccounts();
      //! HOW IS THIS GETTING METAMASK?
      console.log("ACCOUNTS", accounts);
      setConnectedAccounts(accounts);
    })();

    provider.on("accountsChanged", (accounts: string[]) => {
      setConnectedAccounts(accounts);
    });

    provider.on("chainChanged", (chainId: number) => {
      setChainId(chainId);
    });

    provider.on("connect", (info: { chainId: number }) => {
      console.log("CONNECT", info);
      setChainId(info.chainId);
    });

    provider.on("disconnect", (err: { code: number; message: string }) => {
      console.log("DISCONNECT", err);
      web3.setProvider("ws://localhost:8546");
      setConnected(false);
    });
  }, [provider]);

  useEffect(() => {
    if (!isClient() || !mintContract) return;
    //! Set all static data
    console.log("HANDLING SYNCHRONOUS DATA");
    (async () => {
      const presaleRes = await mintContract.methods.isPresale().call();
      setIsPresale(presaleRes);
      const maxSupply = await mintContract.methods.maxSupply().call();
      setMaxSupply(maxSupply);
      const totalSupply = await mintContract.methods.totalSupply().call();
      setTotalSupply(totalSupply);
    })();
  }, [mintContract]);

  useEffect(() => {
    if (!isClient()) return;
    const accountConnected = !(!connectedAccounts || !connectedAccounts[0]);

    // TODO: Make auth request depend on presale state to reduce traffic

    (async () => {
      if (!accountConnected) return setFreeMintWhitelistAuth(undefined);
      let auth;
      try {
        auth = await getMintAuth(connectedAccounts[0], authStage.FREE_MINT);
        console.log("WHITELIST AUTHORIZED", auth);
      } catch (err) {
        auth = null;
        console.error("WHITELIST DENIED", err);
      }
      setFreeMintWhitelistAuth(auth);
    })();

    (async () => {
      if (!accountConnected) return setPresaleWhitelistAuth(undefined);
      let auth;
      try {
        auth = await getMintAuth(connectedAccounts[0], authStage.PRESALE);
        console.log("WHITELIST AUTHORIZED", auth);
      } catch (err) {
        auth = null;
        console.error("WHITELIST DENIED", err);
      }
      setPresaleWhitelistAuth(auth);
    })();

    setConnected(accountConnected);
  }, [connectedAccounts]);

  useEffect(() => {
    if (!isClient() || connected) return;
    setConnectedAccounts(null);
    setProvider(null);
  }, [connected]);

  //* EXPOSE GLOBAL STATE & ACTIONS
  const context: Web3ContextValues = {
    web3,
    provider,
    setProvider,
    mintContract,
    looksContract,
    connected,
    setConnected,
    chainId,
    setChainId,
    connectedAccounts,
    setConnectedAccounts,
    isMinting,
    setIsMinting,
    freeMintWhitelistAuth,
    presaleWhitelistAuth,
    isPresale,
    maxSupply,
    totalSupply,
    setTotalSupply,
    freeMintAvailable,
    maxPerTxn,
    ethPrice,
    looksPrice,
    accountNFTsMinted,
    looksBalanceApproved
  };

  return <Web3Context.Provider value={context} {...props} />;
}