import type { Product } from "@prisma/client";

import type { ActiveProductOverlay } from "../types/socket.types";

export function mapProductToOverlay(product: Product): ActiveProductOverlay {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    imageUrl: product.imageUrl,
  };
}
