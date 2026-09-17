// SCDOR ST-575: Charleston, Charleston County general sales tax, September 2026.
// This marketplace fulfills physical products locally in Charleston. Revisit this
// rate if fulfillment locations or South Carolina tax rates change.
export const CHARLESTON_PHYSICAL_PRODUCT_TAX_RATE = 0.09;

export function marketplaceTotal(itemPrice: number, taxCategory: string) {
  const subtotalCents = Math.max(0, Math.round(itemPrice * 100));
  const taxRate =
    taxCategory === "Physical product"
      ? CHARLESTON_PHYSICAL_PRODUCT_TAX_RATE
      : 0;
  const taxCents = Math.round(subtotalCents * taxRate);
  return {
    subtotal: subtotalCents / 100,
    salesTax: taxCents / 100,
    salesTaxRate: taxRate,
    total: (subtotalCents + taxCents) / 100,
  };
}
