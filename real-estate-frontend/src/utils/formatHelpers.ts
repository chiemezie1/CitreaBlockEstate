/**
 * Helper function to convert satoshi to cBTC (1 cBTC = 100 satoshi).
 * @param satoshi - The amount in satoshi to be converted.
 * @returns The converted amount in cBTC formatted to 5 decimal places.
 */
export function formatToCBTC(satoshi: bigint): string {
    // Assuming 1 cBTC = 100 satoshi for this example
    const cBTC = satoshi / BigInt(100);  // Convert satoshi to cBTC
    return (Number(cBTC) / 100).toFixed(5); // Show the result with 5 decimal places
  }
  