import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import Web3 from "web3";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import { isClient } from "@utils";

import type { AuthData } from "@api/authorizePresaleMint";

// bool presale
// getNftClaim

export enum SaleStage {
  COMING_SOON = 0,
  FREE,
  WHITELIST,
  PUBLIC,
  SOLD_OUT,
}

//* I probably handle most of this from Web3Connection.Provider so I can remove some useState shit
export type Web3ContextValues = {
  web3?: Web3;

  contract?: any;
  setContract?: React.Dispatch<any>;

  saleStage: SaleStage;
  setSaleStage?: React.Dispatch<SaleStage>;

  ethBalance?: number;
  setEthBalance?: React.Dispatch<number>;

  looksBalance?: number;
  setLooksBalance?: React.Dispatch<number>;

  clientAddress?: string | null;
  setClientAddress?: React.Dispatch<string | null>;

  isMinting: boolean;
  setIsMinting?: React.Dispatch<boolean>;

  whitelistAuth?: AuthData | null; //TODO: import whitelistAuth type from api
  setWhitelistAuth?: React.Dispatch<undefined | AuthData | null>;

  freeMintAllowed: boolean;
  setFreeMintAllowed?: React.Dispatch<boolean>;

  quantityMinted?: number;
  setQuantityMinted?: React.Dispatch<number>;

  quantityRemaining?: number;
  setQuantityRemaining?: React.Dispatch<number>;
};

//Whitelist authorization can be undefined, null, or an auth object

const Web3Context = createContext<Web3ContextValues>({
  saleStage: SaleStage.COMING_SOON,
  isMinting: false,
  freeMintAllowed: false,
});

export const ConnectionProvider = ({ abi, contractAddress, ...props }) => {
  //! Is this provider loading properly? Says can't establish a connection...
  //? Should this only run on the client aswell?

  const web3 = useMemo(() => new Web3(Web3.givenProvider), []);

  const [contract, setContract] = useState<null | any>(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [looksBalance, setLooksBalance] = useState(0);
  const [quantityRemaining, setQuantityRemaining] = useState(0);

  // * Check Balance with web3. Don't care tbh
  const [quantityMinted, setQuantityMinted] = useState(0);

  // * Contract.methods.availableFreeMint()
  const [freeMintAllowed, setFreeMintAllowed] = useState(false);

  // * presale?
  const [saleStage, setSaleStage] = useState(SaleStage.COMING_SOON);

  // * Contract.methods.availableFreeMint()
  const [clientAddress, setClientAddress] = useState<string | null>(null);

  // *  local
  const [isMinting, setIsMinting] = useState(false);

  // * local
  const [whitelistAuth, setWhitelistAuth] = useState<
    undefined | AuthData | null
  >();

  // * totalSupply

  const [totalSupply, setTotalSupply] = useState(0);

  // Query Metamask
  useEffect(() => {
    if (!isClient()) return;

    // setClientAddress()

    // const ethereum = window.ethereum;

    (async () => {
      const accounts = await web3.eth.getAccounts();
      //   const networkId = await ethereum.request({
      //     method: "net_version",
      //   });
      console.log(accounts)
      setClientAddress(accounts[0]);
    })();

    // ethereum.on("accountsChanged", (accounts) => {
    //     setClientAddress(accounts[0])
    // });

    // ethereum.on("chainChanged", () => {
    //   window.location.reload();
    // });
  }, []);

  // * STUFF
  useEffect(() => {
    if (!contract) return;
    (async () => {
      const res: number | null = await contract.methods.maxSupply().call();
      setTotalSupply(res || 0);
    })();
  }, [contract]);

  // Instantiate a contract object
  useEffect(() => {
    if (!isClient()) return;
    const contract = new web3.eth.Contract(abi, contractAddress);
    setContract(contract);
    console.log("Contract Initialized");
  }, [contractAddress, abi]); //Include client's wallet address aswell

  useEffect(() => {
    //setSaleStage(getSaleStage())
  }, [quantityRemaining]);

  useEffect(() => {}, [quantityMinted]);

  const context: Web3ContextValues = {
    web3,
    contract,
    setContract,
    contractAddress, //TODO: just pull from contract?
    saleStage,
    setSaleStage,
    ethBalance,
    setEthBalance,
    looksBalance,
    setLooksBalance,
    clientAddress, //TODO: Upgrade to clientAccount?
    setClientAddress,
    isMinting,
    setIsMinting,
    quantityMinted,
    setQuantityMinted,
    quantityRemaining,
    setQuantityRemaining,
    freeMintAllowed,
    setFreeMintAllowed,
    whitelistAuth,
    setWhitelistAuth,
    totalSupply,
    setTotalSupply,

    //? This is probably just available on contract object
  };

  return <Web3Context.Provider value={context} {...props} />;
};

export function useWeb3() {
  return useContext(Web3Context);
}

// Different States:

//Free Mint
//Presale
// MUST be authorized: Whitelisted on Site

//Public Sale

/* 
    RELOAD STATE ON EVERY TXN

    Free Mint
    -Can only mint one

    Presale
    -Authorized by Site on wallet connection or walletConnectionChanged
    -Has verified tokens ()
    -Pay with LOOKS or ETH
    -MintAmount, max per txn

    Public Sale
    -Pay with LOOKS or ETH
    -MintAmount, max per txn
    -SOLD OUT
*/
