import { Balance, BalancesContext, Contract } from '@lib/adapter'
import { call } from '@lib/call'
import { BN_ZERO } from '@lib/math'
import { multicall } from '@lib/multicall'
import { Token } from '@lib/token'
import { isSuccess } from '@lib/type'
import { BigNumber } from 'ethers'

const abi = {
  indexesFor: {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'indexesFor',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  pendingFor: {
    inputs: [
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'uint256', name: '_index', type: 'uint256' },
    ],
    name: 'pendingFor',
    outputs: [
      { internalType: 'uint256', name: 'payout_', type: 'uint256' },
      { internalType: 'bool', name: 'matured_', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
}

const FLOOR: Token = {
  chain: 'ethereum',
  address: '0xf59257E961883636290411c11ec5Ae622d19455e',
  decimals: 9,
  symbol: 'FLOOR ',
}

const gFLOOR: Token = {
  chain: 'ethereum',
  address: '0xb1cc59fc717b8d4783d41f952725177298b5619d',
  decimals: 18,
  symbol: 'gFLOOR',
}

export async function getVesterBalances(ctx: BalancesContext, vester: Contract): Promise<Balance> {
  const { output: userIndexesRes } = await call({
    ctx,
    target: vester.address,
    params: [ctx.address],
    abi: abi.indexesFor,
  })

  const balancesOfRes = await multicall({
    ctx,
    calls: userIndexesRes.map((index: number) => ({ target: vester.address, params: [ctx.address, index] })),
    abi: abi.pendingFor,
  })

  const aggregatedVestingBalances = balancesOfRes.reduce((acc: BigNumber, current: any) => {
    const payout = isSuccess(current) ? BigNumber.from(current.output.payout_) : BN_ZERO
    return acc.add(payout)
  }, BN_ZERO)

  return {
    ...vester,
    decimals: 18,
    amount: BigNumber.from(aggregatedVestingBalances),
    symbol: gFLOOR.symbol,
    underlyings: [FLOOR],
    rewards: undefined,
    category: 'vest',
  }
}