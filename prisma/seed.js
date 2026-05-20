"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const env_1 = require("../src/config/env");
const prisma = new client_1.PrismaClient({
    adapter: new adapter_mariadb_1.PrismaMariaDb(env_1.env.DATABASE_URL),
});
const seedProducts = [
    {
        name: "Sepatu Sneakers",
        description: "Sneakers kasual untuk demo overlay live commerce.",
        price: 399000,
        imageUrl: "https://picsum.photos/seed/sneakers/800/800",
        stock: 18,
    },
    {
        name: "Hoodie Oversize",
        description: "Hoodie santai dengan visual yang cocok untuk presentasi produk.",
        price: 289000,
        imageUrl: "https://picsum.photos/seed/hoodie/800/800",
        stock: 24,
    },
    {
        name: "Tas Kulit",
        description: "Tas premium untuk menampilkan feel eksklusif di layar.",
        price: 759000,
        imageUrl: "https://picsum.photos/seed/bag/800/800",
        stock: 7,
    },
    {
        name: "Jam Tangan",
        description: "Jam tangan minimalis untuk simulasi overlay produk high-value.",
        price: 1299000,
        imageUrl: "https://picsum.photos/seed/watch/800/800",
        stock: 12,
    },
    {
        name: "Botol Minum",
        description: "Produk tambahan untuk memastikan daftar seed berisi variasi item.",
        price: 89000,
        imageUrl: "https://picsum.photos/seed/bottle/800/800",
        stock: 40,
    },
];
async function main() {
    await prisma.product.deleteMany();
    await prisma.product.createMany({
        data: seedProducts,
    });
    console.log(`Seeded ${seedProducts.length} products.`);
}
main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
