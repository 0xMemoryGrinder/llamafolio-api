import { Balance, BalancesContext, Contract } from '@lib/adapter'
import { call } from '@lib/call'
import { Token } from '@lib/token'
import { BigNumber } from 'ethers'

const abi = {
  calculatePendingRewards: {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'calculatePendingRewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  calculateSharesValueInX2Y2: {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'calculateSharesValueInX2Y2',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
}
const x2y2: Token = {
  chain: 'ethereum',
  address: '0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9',
  decimals: 18,
  symbol: 'X2Y2',
}

const weth: Token = {
  chain: 'ethereum',
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  decimals: 18,
  symbol: 'WETH',
}

export async function getX2Y2StakerBalances(ctx: BalancesContext, staker: Contract): Promise<Balance> {
  const [{ output: balanceOf }, { output: pendingReward }] = await Promise.all([
    call({
      ctx,
      target: staker.address,
      params: [ctx.address],
      abi: abi.calculateSharesValueInX2Y2,
    }),
    call({
      ctx,
      target: staker.address,
      params: [ctx.address],
      abi: abi.calculatePendingRewards,
    }),
  ])

  return {
    ...staker,
    amount: BigNumber.from(balanceOf),
    underlyings: [x2y2],
    rewards: [{ ...weth, amount: BigNumber.from(pendingReward) }],
    category: 'stake',
  }
}