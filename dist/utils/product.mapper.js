"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProductToOverlay = mapProductToOverlay;
function mapProductToOverlay(product) {
    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
    };
}
