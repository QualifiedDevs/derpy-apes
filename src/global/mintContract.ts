import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { atom, useAtom, useSetAtom } from "jotai";

import defaultProvider from "@utils/defaultProvider";

import abi from "@src/artifacts/mintContract/abi.json";
import metadata from "@src/artifacts/mintContract/metadata.json";

import { useWeb3, providerAtom, signerAtom } from "@src/global/web3";

export const contractAtom = atom(
  new ethers.Contract(metadata.address, abi, defaultProvider)
);

const updateContractProviderAtom = atom(
  (get) => get(contractAtom),
  (get, set) => {
    set(contractAtom, (prev) =>
      prev.connect(get(signerAtom) || get(providerAtom))
    );
  }
);

export const isMintingAtom = atom(false);

async function getReadonlyProperty(
  propertyName: string,
  contract: any,
  args?: any
) {
  let res = null;
  try {
    res = args
      ? await contract[propertyName](args)
      : await contract[propertyName]();
  } catch (err) {
    console.error(`Query for property ${propertyName} failed`);
    throw err;
  }
  return res;
}

export const totalSupplyResultAtom = atom({
  error: null,
  data: null,
  loading: false,
});
const runFetchTotalSupplyAtom = atom(null, (get, set) => {
  async function fetchData() {
    set(totalSupplyResultAtom, (prev) => ({ ...prev, loading: true }));
    try {
      const res = await getReadonlyProperty("totalSupply", get(contractAtom));
      set(totalSupplyResultAtom, {
        data: res.toNumber(),
        error: null,
        loading: false,
      });
    } catch (error: any) {
      set(totalSupplyResultAtom, { data: null, loading: false, error });
      console.error(error);
    }
  }
  fetchData();
});

export const maxSupplyResultAtom = atom({
  error: null,
  data: null,
  loading: false,
});
const runFetchMaxSupplyAtom = atom(null, (get, set) => {
  async function fetchData() {
    set(maxSupplyResultAtom, (prev) => ({ ...prev, loading: true }));
    try {
      const res = await getReadonlyProperty("maxSupply", get(contractAtom));
      set(maxSupplyResultAtom, {
        data: res.toNumber(),
        error: null,
        loading: false,
      });
    } catch (error: any) {
      set(maxSupplyResultAtom, { data: null, loading: false, error });
      console.error(error);
    }
  }
  fetchData();
});

export const soldOutResultAtom = atom((get) => {
  const maxSupplyRes = get(maxSupplyResultAtom);
  const totalSupplyRes = get(totalSupplyResultAtom);

  const loading = maxSupplyRes.loading && totalSupplyRes.loading;

  const maxSupply = maxSupplyRes.data;
  const totalSupply = totalSupplyRes.data;

  try {
    if (maxSupplyRes.error && totalSupplyRes.error)
      throw "soldOut update failed, maxSupply and totalSupply errored";
    if (maxSupplyRes.error) throw "soldOut update failed, maxSupply errored";
    if (totalSupplyRes.error)
      throw "soldOut update failed, totalSupply errored";
  } catch (error) {
    return { data: null, loading, error };
  }

  const data = maxSupply && totalSupply ? totalSupply === maxSupply : null;

  return { data, loading, error: null };
});

export const costResultAtom = atom({
  error: null,
  data: null,
  loading: false,
});
const runFetchCostAtom = atom(null, (get, set) => {
  async function fetchData() {
    set(costResultAtom, (prev) => ({ ...prev, loading: true }));
    try {
      const res = await getReadonlyProperty("Ethcost", get(contractAtom));
      set(costResultAtom, {
        data: res,
        error: null,
        loading: false,
      });
    } catch (error: any) {
      set(costResultAtom, { data: null, loading: false, error });
      console.error(error);
    }
  }
  fetchData();
});

export const maxPerTxnResultAtom = atom({
  error: null,
  data: null,
  loading: false,
});
const runFetchMaxPerTxnAtom = atom(null, (get, set) => {
  async function fetchData() {
    set(maxPerTxnResultAtom, (prev) => ({ ...prev, loading: true }));
    try {
      const res = await getReadonlyProperty(
        "maxMintAmountPerTx",
        get(contractAtom)
      );
      set(maxPerTxnResultAtom, {
        data: res.toNumber(),
        error: null,
        loading: false,
      });
    } catch (error: any) {
      set(maxPerTxnResultAtom, { data: null, loading: false, error });
      console.error(error);
    }
  }
  fetchData();
});

export function useMintContract() {
  const { provider, signer } = useWeb3();

  const [, updateTotalSupply] = useAtom(runFetchTotalSupplyAtom);
  const [, updateMaxSupply] = useAtom(runFetchMaxSupplyAtom);
  const [, updateCost] = useAtom(runFetchCostAtom);
  const [, updateMaxPerTxn] = useAtom(runFetchMaxPerTxnAtom);
  const [, updateContractProvider] = useAtom(updateContractProviderAtom);

  const [isMinting] = useAtom(isMintingAtom);

  useEffect(() => {
    if (!provider) return;
    updateContractProvider();
  }, [provider, signer]);

  useEffect(() => {
    updateCost();
    updateTotalSupply();
    updateMaxSupply();
    updateMaxPerTxn();
  }, [isMinting]);
}
