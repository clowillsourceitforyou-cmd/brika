export function money(amount: number, symbol = "DT"): string {
  const n = Number(amount || 0);
  const formatted = n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
  return `${formatted} ${symbol}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
