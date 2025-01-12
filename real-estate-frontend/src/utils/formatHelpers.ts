/**
 * Helper function to convert satoshi to cBTC (1 cBTC = 100,000,000 satoshi).
 * @param satoshi - The amount in satoshi to be converted.
 * @returns The converted amount in cBTC formatted to 8 decimal places.
 */
export function formatToCBTC(satoshi: bigint): string {
  const cBTC = Number(satoshi) / 100000000;
  return cBTC.toFixed(8); // Show the result with 8 decimal places for full precision
}

/**
 * Helper function to convert cBTC to satoshi (1 cBTC = 100,000,000 satoshi).
 * @param cBTC - The amount in cBTC to be converted.
 * @returns The converted amount in satoshi as a bigint.
 */
export function cBTCToSatoshi(cBTC: string): bigint {
  return BigInt(Math.floor(parseFloat(cBTC) * 100000000));
}

