import type { Product } from "@prisma/client";

import { prisma } from "../../lib/prisma";

// Product access stays behind this service so realtime handlers only handle flow control.
export class ProductService {
  public async getProductById(productId: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  public async listProducts(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const productService = new ProductService();
