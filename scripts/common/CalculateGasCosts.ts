import { ContractReceipt } from "ethers"

export const calculateGasCosts = (txReceipt: ContractReceipt) => {
  const gasUsed = txReceipt.gasUsed
  const pricePerGas = txReceipt.effectiveGasPrice
  const gasCosts = gasUsed.mul(pricePerGas)
  return gasCosts
}
