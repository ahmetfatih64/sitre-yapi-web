import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString("tr-TR")} m²`;
}
