import Web3 from "web3"

export default function mapToChecksum(addresses: string[]) {
    return addresses.map((address) => Web3.utils.toChecksumAddress(address))
}