
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatMYR(amount) {
  if (amount === null || amount === undefined) return 'RM 0.00';
  const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  return `RM ${numAmount.toFixed(2)}`;
}
