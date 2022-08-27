import path from "path";
import fetch from "node-fetch";
import { BigNumber } from "ethers";
import millify from "millify";

import {
  Adapter,
  Balance,
  BaseContext,
  CategoryBalances,
} from "../src/lib/adapter";
import { getPricedBalances } from "../src/lib/price";

Object.defineProperties(BigNumber.prototype, {
  toJSON: {
    value: function (this: BigNumber) {
      return this.toString();
    },
  },
});

function help() {
  console.log("npm run {adapter} {address}");
}

async function main() {
  // argv[0]: ts-node
  // argv[1]: run-adapter.ts
  // argv[2]: adapter
  // argv[3]: address

  const startTime = Date.now();

  if (process.argv.length < 3) {
    console.error("Missing adapter argument");
    return help();
  }
  if (process.argv.length < 4) {
    console.error("Missing address argument");
    return help();
  }
  const address = process.argv[3].toLowerCase();

  const ctx: BaseContext = { address };

  const module = await import(
    path.join(__dirname, "..", "src", "adapters", process.argv[2])
  );
  const adapter = module.default as Adapter;

  const contractsRes = await adapter.getContracts();

  const balancesRes = await adapter.getBalances(ctx, contractsRes.contracts);

  const yieldsRes = await fetch("https://yields.llama.fi/pools");
  const yieldsData = (await yieldsRes.json()).data;

  const yieldsByPoolAddress: { [key: string]: any } = {};
  for (let i = 0; i < yieldsData.length; i++) {
    yieldsByPoolAddress[yieldsData[i].pool.toLowerCase()] = yieldsData[i];
  }

  const pricedBalances = await getPricedBalances(balancesRes.balances);

  console.log(`Found ${pricedBalances.length} non zero balances`);

  // group by category
  const balancesByCategory: Record<string, Balance[]> = {};
  for (const balance of pricedBalances) {
    if (!balancesByCategory[balance.category]) {
      balancesByCategory[balance.category] = [];
    }
    balancesByCategory[balance.category].push(balance);
  }

  const categoriesBalances: CategoryBalances[] = [];
  for (const category in balancesByCategory) {
    const cat: CategoryBalances = {
      title: category,
      totalUSD: 0,
      balances: [],
    };

    for (const balance of balancesByCategory[category]) {
      cat.totalUSD += balance.balanceUSD || 0;
      cat.balances.push(balance);
    }

    // sort by balanceUSD
    cat.balances.sort((a, b) => {
      if (a.balanceUSD != null && b.balanceUSD == null) {
        return -1;
      }
      if (a.balanceUSD == null && b.balanceUSD != null) {
        return 1;
      }
      return b.balanceUSD - a.balanceUSD;
    });

    categoriesBalances.push(cat);
  }

  // sort categories by total balances
  categoriesBalances.sort((a, b) => b.totalUSD - a.totalUSD);

  for (const categoryBalances of categoriesBalances) {
    console.log(
      `Category: ${categoryBalances.title}, totalUSD: ${millify(
        categoryBalances.totalUSD
      )} (${categoryBalances.totalUSD})`
    );

    const data: any[] = [];

    for (const balance of categoryBalances.balances) {
      const key = `${balance.yieldsAddress?.toLowerCase()}-${balance.chain}`;
      const subKey = `${balance.yieldsAddress?.toLowerCase()}`;
      const yieldObject =
        yieldsByPoolAddress[key] || yieldsByPoolAddress[subKey];

      const d = {
        address: balance.address,
        category: balance.category,
        symbol: balance.symbol,
        balance: millify(balance.amount / 10 ** balance.decimals),
        balanceUSD: `$${millify(
          balance.balanceUSD !== undefined ? balance.balanceUSD : 0
        )}`,
        yield: `${
          yieldObject !== undefined ? yieldObject?.apy.toFixed(2) + "%" : "-"
        }`,
        il: `${yieldObject !== undefined ? yieldObject?.ilRisk : "-"}`,
        rewards: balance.rewards !== undefined ? true : false,
      };

      if (balance.rewards) {
        for (let index = 0; index < balance.rewards.length; index++) {
          const rewardR = balance.rewards[index];
          const r = {
            address: rewardR.address,
            category: rewardR.category,
            symbol: rewardR.symbol,
            balance: millify(rewardR.amount / 10 ** rewardR.decimals),
            balanceUSD: `$${millify(
              rewardR.balanceUSD !== undefined ? rewardR.balanceUSD : 0
            )}`,
            yield: `${
              yieldObject !== undefined
                ? yieldObject?.apy.toFixed(2) + "%"
                : "-"
            }`,
            il: `${yieldObject !== undefined ? yieldObject?.ilRisk : "-"}`,
          };

          data.push(r);
        }
      }

      data.push(d);
    }

    console.table(data);
  }

  const endTime = Date.now();
  console.log(`Completed in ${endTime - startTime}ms`);
}

main();
