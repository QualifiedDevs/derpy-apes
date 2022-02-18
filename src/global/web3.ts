import { atom, useAtom } from "jotai";
import { ethers } from "ethers";

import defaultProvider from "@utils/defaultProvider";

export const providerAtom = atom(defaultProvider);

export const signerAtom = atom((get) => {
  const provider = get(providerAtom) as any;
  const signer = provider.getSigner ? provider.getSigner() : null;
  return signer;
});

export const addressResultAtom = atom({
  data: null,
  error: null,
  loading: false,
});

export const addressAtom = atom((get) => get(addressResultAtom).data || null);

// TODO: Run whenever the signer changes, among other things.
export const runFetchAddressAtom = atom(
  (get) => get(addressResultAtom),
  (get, set, args) => {
    const signer = get(signerAtom);

    if (!signer) {
      set(addressResultAtom, {
        loading: false,
        error: null,
        data: null,
      });
      return;
    }

    async function updateAddress() {
      set(addressResultAtom, (prev) => ({ ...prev, loading: true }));
      try {
        const res = await signer.getAddress(); //! Can this return null or empty table?
        set(addressResultAtom, {
          error: null,
          loading: false,
          data: ethers.utils.getAddress(res) as any,
        });
        //? Convert to checksum?
      } catch (error: any) {
        set(addressResultAtom, { error, loading: false, data: null });
      }
    }
    updateAddress();
  }
);

export function useWeb3() {
  const [provider, setProvider] = useAtom(providerAtom);
  const [signer] = useAtom(signerAtom);
  const [address] = useAtom(addressAtom);

  function connect(provider: any) {
    setProvider(provider);
  }

  function disconnect() {
    setProvider(defaultProvider);
  }

  return { connect, disconnect, provider, signer, address };
}