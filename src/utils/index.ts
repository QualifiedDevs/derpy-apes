import sign from "./sign";
import getMintAuth from "./getMintAuth";

export function isClient() {
    return typeof window !== 'undefined'
}

export { sign, getMintAuth };