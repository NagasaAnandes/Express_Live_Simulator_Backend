import type { ActiveProductOverlay } from "../../../types/socket.types";

// Simple in-memory cache for ActiveProductOverlay by product id.
const cache = new Map<string, ActiveProductOverlay>();

export function getCachedProduct(id: string): ActiveProductOverlay | undefined {
  return cache.get(id);
}

export function setCachedProduct(
  id: string,
  product: ActiveProductOverlay,
): void {
  cache.set(id, product);
}

export function clearCachedProduct(id: string): void {
  cache.delete(id);
}

export function clearAllProducts(): void {
  cache.clear();
}
