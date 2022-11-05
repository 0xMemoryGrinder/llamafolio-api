import { Adapter, Contract, GetBalancesHandler } from "@lib/adapter";
import { getStakeBalances, getFormattedStakeBalances } from "./balances";

const sOHM: Contract = {
  name: "Staked OHM",
  chain: "ethereum",
  address: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
  symbol: "sOHM",
  decimals: 9,
};

const gOHM: Contract = {
  name: "Governance OHM",
  chain: "ethereum",
  address: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
  symbol: "gOHM",
  decimals: 18,
};

const getContracts = async () => {
  return {
    contracts: { sOHM, gOHM },
  };
};

const getBalances: GetBalancesHandler<typeof getContracts> = async (
  ctx,
  { sOHM, gOHM }
) => {
  const [stakeBalances, formattedBalance] = await Promise.all([
    getStakeBalances(ctx, "ethereum", sOHM || []),
    getFormattedStakeBalances(ctx, "ethereum", gOHM || []),
  ]);

  const balances = [...stakeBalances, ...formattedBalance];

  return {
    balances,
  };
};

const adapter: Adapter = {
  id: "olympus-dao",
  getContracts,
  getBalances,
};

export default adapter;