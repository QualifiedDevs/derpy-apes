import { SaleStage } from "@components/Web3Connection";

// Just need to query smart contract, get current date

export default function getSaleStage(
  contract: any,  //? How do I get contract type?
  currentStage: SaleStage,
  endDate: Date,
  quantityRemaining: number,
  setTotalQuantity: number
) {
  //if (quantityRemaining == 0) return SaleStage.SOLD_OUT
  //if (endDate - Date.now > 0 return SaleStage.COMING_SOON)
  //return await contract.getCurrentStage()

  return SaleStage.COMING_SOON;
}