import { BaseContext, Contract, GetBalancesHandler } from '@lib/adapter'
import { resolveBalances } from '@lib/balance'
import { Chain } from '@lib/chains'
import { BN_TEN } from '@lib/math'
import { getSingleStakeBalance } from '@lib/stake'
import { ETH, Token } from '@lib/token'
import { BigNumber } from 'ethers'

const abi = {
  getNodeRPLStake: {
    inputs: [{ internalType: 'address', name: '_nodeAddress', type: 'address' }],
    name: 'getNodeRPLStake',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  getNodeActiveMinipoolCount: {
    inputs: [{ internalType: 'address', name: '_nodeAddress', type: 'address' }],
    name: 'getNodeActiveMinipoolCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
}

const RPL: Token = {
  chain: 'ethereum',
  address: '0xd33526068d116ce69f19a9ee46f0bd304f21a51f',
  symbol: 'RPL',
  decimals: 18,
  coingeckoId: 'rocket-pool',
}

const nodeStaking: Contract = {
  name: 'Staking',
  chain: 'ethereum',
  decimals: 18,
  symbol: 'RPL',
  address: '0x3019227b2b8493e45bf5d25302139c9a2713bf15',
  underlyings: [RPL],
}

const miniPoolManager: Contract = {
  name: 'Mini Pool Manager',
  chain: 'ethereum',
  address: '0x6293b8abc1f36afb22406be5f96d893072a8cf3a',
  decimals: 18,
  symbol: 'ETH',
  underlyings: [ETH],
}

function getNodeStakingBalance(ctx: BaseContext, chain: Chain, nodeStaking: Contract) {
  return getSingleStakeBalance(ctx, chain, nodeStaking, {
    abi: abi.getNodeRPLStake,
  })
}

async function getMiniPoolManagerBalance(ctx: BaseContext, chain: Chain, miniPoolManager: Contract) {
  const balance = await getSingleStakeBalance(ctx, chain, miniPoolManager, {
    abi: abi.getNodeActiveMinipoolCount,
  })

  // 16 ETH required (not 32)
  // See: https://rocketpool.net/#stake-run-node
  balance.amount = balance.amount.mul(BigNumber.from('16').mul(BN_TEN.pow(18)))

  return balance
}

export const getContracts = () => {
  return {
    contracts: { miniPoolManager, nodeStaking },
  }
}

export const getBalances: GetBalancesHandler<typeof getContracts> = async (ctx, contracts) => {
  console.log(contracts)

  const balances = await resolveBalances<typeof getContracts>(ctx, 'ethereum', contracts, {
    miniPoolManager: getMiniPoolManagerBalance,
    nodeStaking: getNodeStakingBalance,
  })

  return {
    balances,
  }
}