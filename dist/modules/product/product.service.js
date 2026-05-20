"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const prisma_1 = require("../../lib/prisma");
// Product access stays behind this service so realtime handlers only handle flow control.
class ProductService {
    async getProductById(productId) {
        return prisma_1.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });
    }
    async listProducts() {
        return prisma_1.prisma.product.findMany({
            orderBy: {
                createdAt: "asc",
            },
        });
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
