import aaveV2 from "@adapters/aave/v2";
import concentrator from "@adapters/concentrator";
import convex from "@adapters/convex";
import curve from "@adapters/curve";
import geist from "@adapters/geist";
import gmx from "@adapters/gmx";
import pancakeswap from "@adapters/pancakeswap";
import pangolin from "@adapters/pangolin";
import spiritswap from "@adapters/spiritswap";
import spookyswap from "@adapters/spookyswap";
import traderjoe from "@adapters/traderjoe";
import uniswap from "@adapters/uniswap";
import valas from "@adapters/valas";
import wallet from "@adapters/wallet";
import { Adapter } from "@lib/adapter";

export const adapters: Adapter[] = [
  aaveV2,
  concentrator,
  convex,
  curve,
  geist,
  gmx,
  pancakeswap,
  pangolin,
  spiritswap,
  spookyswap,
  traderjoe,
  uniswap,
  valas,
  wallet,
];

export const adapterById: { [key: string]: Adapter } = {};
for (const adapter of adapters) {
  adapterById[adapter.id] = adapter;
}
