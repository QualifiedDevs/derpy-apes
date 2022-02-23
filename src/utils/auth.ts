import { ethers } from "ethers";
import type { Signer, Signature } from "ethers";
// import useWeb3?

export type SignerAuth = {
    signer: string,
    hash: string
}

export async function requestSignatureAuth(signer: Signer, message: string) {
    //TODO: Get signer from client
    const signature = await signer.signMessage(message)
    console.log("Signature:", signature)
    const auth: SignerAuth = {signer: "PLACEHOLDER_ADDRESS", hash: "PLACEHOLDER_HASH"}
    return auth;
}

export async function verifySignatureAuth(auth: SignerAuth) {
    //* Check authorization from server!
    return true;
}

//TODO: Verify this wallet owns a token
//TODO: Verify this wallet is an admin (check JSON table)

//! Request Token Auth
//! Verify Token Auth (User vs. Admin)