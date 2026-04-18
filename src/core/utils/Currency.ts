export class CurrencyCalculator {
  /**
   * Converts a decimal amount to atomic units (e.g., 499.00 -> 49900)
   * to avoid floating point errors during calculation.
   */
  static toAtomic(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Converts atomic units back to standard decimal representation.
   */
  static fromAtomic(atomicAmount: number): number {
    return atomicAmount / 100;
  }
}
