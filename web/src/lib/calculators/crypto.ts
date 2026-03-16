export type ProfitLossInputs = {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  feePercent: number;
};

export function profitLoss({ buyPrice, sellPrice, quantity, feePercent }: ProfitLossInputs) {
  const safeQuantity = Math.max(0, quantity);
  const cost = Math.max(0, buyPrice) * safeQuantity;
  const revenue = Math.max(0, sellPrice) * safeQuantity;
  const feeRate = Math.max(0, feePercent) / 100;
  const fees = (cost + revenue) * feeRate;
  const profit = revenue - cost - fees;
  const roi = cost === 0 ? 0 : (profit / cost) * 100;

  return { cost, revenue, fees, profit, roi };
}

export type DcaPurchase = { price: number; amount: number };

export function averageEntryPrice(purchases: DcaPurchase[]) {
  const totals = purchases.reduce(
    (acc, purchase) => {
      const amount = Math.max(0, purchase.amount);
      const cost = Math.max(0, purchase.price) * amount;
      return {
        totalCost: acc.totalCost + cost,
        totalAmount: acc.totalAmount + amount,
      };
    },
    { totalCost: 0, totalAmount: 0 }
  );

  const average = totals.totalAmount === 0 ? 0 : totals.totalCost / totals.totalAmount;
  return { ...totals, average };
}

export function breakEvenExitPrice({
  entryPrice,
  feePercent,
}: {
  entryPrice: number;
  feePercent: number;
}) {
  const feeRate = Math.max(0, feePercent) / 100;
  if (feeRate >= 1) return null;
  return entryPrice * (1 + feeRate) / (1 - feeRate);
}
