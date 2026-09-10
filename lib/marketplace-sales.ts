import{upsertRow}from"@/lib/cms";import type{MarketplaceOrderPayload}from"@/lib/marketplace";

export type MarketplaceSaleState="RESERVED"|"PAID"|"RELEASED"|"REFUND_DUE"|"REFUNDED"|"VOIDED";

export async function syncMarketplaceSale(order:MarketplaceOrderPayload,state:MarketplaceSaleState,extra:Record<string,string>={}){
 const row:Record<string,string>={
  ID:order.orderId,
  OrderID:order.orderId,
  ItemID:order.itemId,
  ItemTitle:order.itemTitle,
  PurchaserName:order.name,
  Email:order.email,
  Phone:order.phone,
  RetailValue:order.retailValue.toFixed(2),
  SalePrice:order.price.toFixed(2),
  Status:state,
  PaymentStatus:order.paymentStatus||"PENDING",
  TransactionID:order.transactionId||"",
  ClaimedAt:order.claimedAt,
  PaidAt:order.paidAt||"",
  UpdatedAt:new Date().toISOString(),
  ...extra,
 };
 return upsertRow("MarketplaceSales",row);
}
