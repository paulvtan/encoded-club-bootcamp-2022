import { BasicToken } from "../../typechain-types"

//This function takes in a ERC20 token contract, and a target adddress then display the account token balance.
export const displayTokenBalance = async (
  tokenContract: BasicToken,
  address: string
) => {
  const [symbol, decimals, accountBalanceDecimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.decimals(),
    tokenContract.balanceOf(address),
  ])
  console.log(`\n`)
  console.log(`Account: ${address}`)
  console.log(`Has the balance of ${accountBalanceDecimals} decimals`)
  console.log(
    `Represents: ${Number(accountBalanceDecimals) / 10 ** decimals} $${symbol}`
  )
  console.log(`\n`)
}
