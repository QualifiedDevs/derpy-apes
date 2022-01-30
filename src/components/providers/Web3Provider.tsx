//@ts-nocheck

import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import Web3 from "web3";

import { getMintAuth, isClient, mapToChecksum } from "@utils";

import type { AuthData } from "@api/authorizePresaleMint";

import mintAbi from "@src/artifacts/mintContract/abi.json";
import mintContractMetadata from "@src/artifacts/mintContract/metadata.json";
import looksAbi from "@src/artifacts/erc20Payable/abi.json";
import looksContractMetadata from "@src/artifacts/erc20Payable/metadata.json";

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

  //TODO: Convert to enum
  projectStage?: number;
  setProjectStage?: React.Dispatch<number>;

  readonlyMintContract?: any;
};

const readonlyWeb3 = new Web3(
  new Web3.providers.WebsocketProvider(
    `wss://rinkeby.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
  )
);

const readonlyMintContract = new readonlyWeb3.eth.Contract(mintAbi, mintContractMetadata.address);

const defaultContext: Web3ContextValues = {
  connectedAccounts: null,
  readonlyMintContract,
  connected: false,
  isMinting: false,
};

export const Web3Context = createContext(defaultContext);

const web3 = new Web3()

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
  const [maxSupply, setMaxSupply] = useState(defaultContext.maxSupply);
  const [totalSupply, setTotalSupply] = useState(defaultContext.totalSupply);
  const [ethPrice, setEthPrice] = useState(defaultContext.ethPrice);
  const [looksPrice, setLooksPrice] = useState(defaultContext.looksPrice);
  const [accountNFTsMinted, setAccountNFTsMinted] = useState<
    number | undefined
  >(defaultContext.accountNFTsMinted);
  const [maxPerTxn, setMaxPerTxn] = useState<number>(defaultContext.maxPerTxn);
  const [looksBalanceApproved, setLooksBalanceApproved] = useState<number>(
    defaultContext.looksBalanceApproved
  );
  const [projectStage, setProjectStage] = useState<number>(
    defaultContext.mintStage
  );
  useEffect(() => {
    if (!isClient() || !connected || !mintContract) return;
    (async () => {
      const res = await mintContract.methods.avaliableFreeMint(3, connectedAccounts[0]).call()
      setFreeMintAvailable(res);
    })()
  },[mintContract, isMinting, connectedAccounts])

  //* MIDDLEWARE FOR STATE CHANGES

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
      setConnectedAccounts(accounts ? mapToChecksum(accounts) : accounts);
    })();

    provider.on("accountsChanged", (accounts: string[]) => {
      setConnectedAccounts(accounts ? mapToChecksum(accounts) : accounts);
    });

    provider.on("chainChanged", (chainId: number) => {
      setChainId(chainId);
    });

    provider.on("connect", (info: { chainId: number }) => {
      setChainId(info.chainId);
    });

    provider.on("disconnect", (err: { code: number; message: string }) => {
      web3.setProvider(null);
      setConnected(false);
    });

  }, [provider]);

  useEffect(() => {
    //? What stats require a provider, which are readonly?
    // if (!isClient()) return;
    // setMintContract(
    //   new web3.eth.Contract(mintAbi, mintContractMetadata.address)
    // );
    // setLooksContract(
    //   new web3.eth.Contract(looksAbi, looksContractMetadata.address)
    // );
  }, [provider]);

  useEffect(() => {
    if (!isClient()) return;
    (async () => {
      const projectStage = await readonlyMintContract.methods.projectStage().call();
      setProjectStage(parseInt(projectStage));  //? why is this a string?
      const maxSupply = await readonlyMintContract.methods.maxSupply().call();
      setMaxSupply(maxSupply);
      const totalSupply = await readonlyMintContract.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      const ethPrice = await readonlyMintContract.methods.Ethcost().call();
      setEthPrice(ethPrice);
      const looksPrice = await readonlyMintContract.methods.LooksCost().call();
      setLooksPrice(looksPrice);
      const maxPerTxn = await readonlyMintContract.methods.maxMintAmountPerTx().call();
      setMaxPerTxn(maxPerTxn)
    })();
  }, [isMinting]);

  useEffect(() => {
    if (!isClient || !looksContract || !mintContract || !connected || !connectedAccounts) return;
    (async () => {
      console.log(provider, looksContract)
      const looksBalanceApproved = await looksContract.methods
        .allowance(connectedAccounts[0], mintContract._address)
        .call();
      setLooksBalanceApproved(looksBalanceApproved);
    })();
  }, [looksContract, mintContract, connectedAccounts, connected]);

  useEffect(() => {
    if (!isClient()) return;
    const accountConnected = !(!connectedAccounts || !connectedAccounts[0]);

    // TODO: Make auth request depend on presale state to reduce traffic

    (async () => {
      if (!accountConnected) return setFreeMintWhitelistAuth(undefined);
      let auth;
      try {
        auth = await getMintAuth(connectedAccounts[0], authStage.FREE_MINT); //? WHY IS IT GIVING WRONG ACCOUNT/
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
    maxSupply,
    totalSupply,
    setTotalSupply,
    freeMintAvailable,
    maxPerTxn,
    ethPrice,
    looksPrice,
    accountNFTsMinted,
    looksBalanceApproved,
    projectStage,
    maxPerTxn
  };

  return <Web3Context.Provider value={context} {...props} />;
}
