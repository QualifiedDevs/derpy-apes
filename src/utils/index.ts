import sign from "./sign";
import getMintAuth from "./getMintAuth";
import updateSaleStage from "./getSaleStage";

export function isClient() {
    return typeof window !== 'undefined'
}

export { sign, getMintAuth, updateSaleStage };