import pool from "@db/pool";
import { isHex, strToBuf } from "@lib/buf";
import { badRequest, notFound, serverError, success } from "./response";

export async function getContract(event, context) {
  // https://github.com/brianc/node-postgres/issues/930#issuecomment-230362178
  context.callbackWaitsForEmptyEventLoop = false; // !important to reuse pool

  const address = event.pathParameters?.address;
  if (!address) {
    return badRequest("Missing address parameter");
  }
  if (!isHex(address)) {
    return badRequest("Invalid address parameter, expected hex");
  }

  const client = await pool.connect();

  try {
    const adaptersContractsRes = await client.query(
      `select adapter_id, chain, data -> 'name' as name, data -> 'displayName' as display_name from adapters_contracts where address = $1::bytea;`,
      [strToBuf(address)]
    );

    if (adaptersContractsRes.rows.length === 0) {
      return notFound();
    }

    return success({
      data: {
        // TODO: resolve name in case multiple adapters use the same contract
        name: adaptersContractsRes.rows[0].name,
        display_name: adaptersContractsRes.rows[0].display_name,
        adapters: adaptersContractsRes.rows.map((row) => ({
          id: row.adapter_id,
          chain: row.chain,
        })),
      },
    });
  } catch (e) {
    return serverError("Failed to retrieve adapters");
  } finally {
    // https://github.com/brianc/node-postgres/issues/1180#issuecomment-270589769
    client.release(true);
  }
}
