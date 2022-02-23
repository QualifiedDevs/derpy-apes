import { atom, useAtom } from "jotai";

import { signerAtom } from "@src/global/web3";
import formatRes from "@utils/formatRes";
import {
  fetchRaffleEntryByWalletAddress,
  fetchLatestRaffle,
} from "@utils/raffleClientAPI";

import type { Raffle, Entry } from "@utils/raffleServerAPI";

export const latestRaffleResponseAtom = atom({
  data: null,
  error: null,
  loading: false,
});

export const runFetchLatestRaffleResponseAtom = atom(
  (get) => latestRaffleResponseAtom,
  (get, set) => {
    //! fetch latest raffle!
    async function fetchData() {
      set(latestRaffleResponseAtom, (prev) => ({ ...prev, loading: true }));
      const [data, error] = await formatRes(fetchLatestRaffle(true));

      if (error) {
        console.error(error);
        set(latestRaffleResponseAtom, { data: null, error, loading: false });
        return;
      }

      set(latestRaffleResponseAtom, { data, error: null, loading: false });
    }
    fetchData();
  }
);

export const enteredNFTResponseAtom = atom({
  data: null,
  error: null,
  loading: false,
});

export const runFetchEnteredNFTResponseAtom = atom(
  (get) => get(enteredNFTResponseAtom),
  (get, set) => {
    const signer = get(signerAtom);
    const latestRaffle = get(latestRaffleResponseAtom).data;

    if (!signer || !latestRaffle) {
      set(enteredNFTResponseAtom, {
        data: null,
        error: null,
        loading: false,
      });
      return;
    }

    async function fetchData() {
      set(enteredNFTResponseAtom, (prev) => ({ ...prev, loading: true }));

      try {
        const address = await signer.getAddress();
        if (!address) {
          throw "No address attached to signer";
        }

        const [data, err] = await formatRes(
          //@ts-ignore
          fetchRaffleEntryByWalletAddress(latestRaffle!.id, address)
        );

        if (err) throw err;

        set(enteredNFTResponseAtom, {
          data: data?.data?.tokenId || null,
          loading: false,
          error: null,
        });
      } catch (error: any) {
        set(enteredNFTResponseAtom, { data: null, loading: false, error });
        console.error(error);
      }
    }

    fetchData();
  }
);
