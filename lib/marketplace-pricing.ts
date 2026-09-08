export const MARKETPLACE_FLOOR_PERCENT = 15;

export interface MarketplacePricedItem {
  RetailValue: string;
  LaunchAt: string;
  EndAt: string;
}

export function parseCharlestonDateTime(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(" ", "T");
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized);
  const date = new Date(hasZone ? normalized : `${normalized}:00-04:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function marketplacePrice(item: MarketplacePricedItem, now = new Date()) {
  const retail = Math.max(0, Number(item.RetailValue) || 0);
  const floor = retail * (MARKETPLACE_FLOOR_PERCENT / 100);
  const start = parseCharlestonDateTime(item.LaunchAt);
  const end = parseCharlestonDateTime(item.EndAt);

  if (!retail) return { price: 0, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (!start || !end || end <= start) return { price: retail, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (now <= start) return { price: retail, percentBelowRetail: 0, progress: 0, started: false, ended: false };
  if (now >= end) return { price: floor, percentBelowRetail: 100 - MARKETPLACE_FLOOR_PERCENT, progress: 1, started: true, ended: true };

  const progress = (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  const price = retail - (retail - floor) * progress;
  return {
    price: Math.max(floor, price),
    percentBelowRetail: (1 - price / retail) * 100,
    progress,
    started: true,
    ended: false,
  };
}
