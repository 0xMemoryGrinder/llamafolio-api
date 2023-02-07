import { Balance, BalancesContext, Contract } from '@lib/adapter'
import { call } from '@lib/call'
import { abi as erc20Abi } from '@lib/erc20'
import { BigNumber } from 'ethers'

const abi = {
  getStETHByWstETH: {
    inputs: [{ internalType: 'uint256', name: '_wstETHAmount', type: 'uint256' }],
    name: 'getStETHByWstETH',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  convertStMaticToMatic: {
    inputs: [{ internalType: 'uint256', name: '_balance', type: 'uint256' }],
    name: 'convertStMaticToMatic',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
}

export async function getWStEthStakeBalances(ctx: BalancesContext, contract: Contract): Promise<Balance[]> {
  const balances: Balance[] = []

  const balanceOfRes = await call({
    ctx,
    target: contract.address,
    params: [ctx.address],
    abi: erc20Abi.balanceOf,
  })

  const converterWStEthToStEthRes = await call({
    ctx,
    target: contract.address,
    params: [balanceOfRes.output],
    abi: abi.getStETHByWstETH,
  })

  const formattedBalanceOf = BigNumber.from(converterWStEthToStEthRes.output)

  balances.push({
    chain: ctx.chain,
    decimals: contract.decimals,
    symbol: contract.symbol,
    address: contract.address,
    amount: formattedBalanceOf,
    category: 'stake',
  })
  return balances
}

export async function getStEthStakeBalances(ctx: BalancesContext, contract: Contract): Promise<Balance[]> {
  const balances: Balance[] = []

  const balanceOfRes = await call({
    ctx,
    target: contract.address,
    params: [ctx.address],
    abi: erc20Abi.balanceOf,
  })

  const balanceOf = BigNumber.from(balanceOfRes.output)

  balances.push({
    chain: ctx.chain,
    decimals: contract.decimals,
    symbol: contract.symbol,
    address: contract.address,
    amount: balanceOf,
    category: 'stake',
  })

  return balances
}

export async function getStMaticBalances(ctx: BalancesContext, contract: Contract): Promise<Balance[]> {
  const balances: Balance[] = []

  const balanceOfRes = await call({
    ctx,
    target: contract.address,
    params: [ctx.address],
    abi: erc20Abi.balanceOf,
  })

  const converterWStEthToStEthRes = await call({
    ctx,
    target: contract.address,
    params: [balanceOfRes.output],
    abi: abi.convertStMaticToMatic,
  })

  const formattedBalanceOf = BigNumber.from(converterWStEthToStEthRes.output[0])

  balances.push({
    chain: ctx.chain,
    decimals: contract.decimals,
    symbol: contract.symbol,
    address: contract.address,
    amount: formattedBalanceOf,
    category: 'stake',
  })

  return balances
}