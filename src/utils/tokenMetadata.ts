import axios from "axios";

export async function getTokenMetadataURI(tokenId: string, contract: any) {

  const tokenIpfsURI = await contract.tokenURI(tokenId);
  const tokenURI = `https://ipfs.io/ipfs/${tokenIpfsURI.slice(7)}`;
  return tokenURI;
}

export async function getTokenMetadataFromURI(metadataURI: string) {
  const tokenURIQueryRes = await axios.get(metadataURI);
  const tokenMetadata = tokenURIQueryRes.data;
  return tokenMetadata;
}

export async function getTokenMetadata(tokenId: string, contract: any) {
  const metadataURI = await getTokenMetadataURI(tokenId, contract);
  const tokenMetadata = getTokenMetadataFromURI(metadataURI);
  return tokenMetadata;
}

export function getTokenImageURIFromMetadata(metadata: any) {
  const imageIpfsURI = metadata.image;
  const imageURI = `https://ipfs.io/ipfs/${imageIpfsURI.slice(7)}`;
  return imageURI;
}

export async function getTokenImageURI(tokenId: string, contract: any) {
  const metadata = await getTokenMetadata(tokenId, contract);
  const imageURI = getTokenImageURIFromMetadata(metadata);
  return imageURI;
}
