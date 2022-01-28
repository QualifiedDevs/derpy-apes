import sign from "./sign";
import getMintAuth from "./getMintAuth";
import mapToChecksum from "./mapToChecksum";

export function isClient() {
    return typeof window !== 'undefined'
}

export { sign, getMintAuth, mapToChecksum };