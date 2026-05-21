"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedProduct = getCachedProduct;
exports.setCachedProduct = setCachedProduct;
exports.clearCachedProduct = clearCachedProduct;
exports.clearAllProducts = clearAllProducts;
// Simple in-memory cache for ActiveProductOverlay by product id.
const cache = new Map();
function getCachedProduct(id) {
    return cache.get(id);
}
function setCachedProduct(id, product) {
    cache.set(id, product);
}
function clearCachedProduct(id) {
    cache.delete(id);
}
function clearAllProducts() {
    cache.clear();
}
