import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { env } from "../src/config/env";

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(env.DATABASE_URL),
});

const seedProducts = [
  {
    name: "Sepatu Sneakers",
    description: "Sneakers kasual untuk demo overlay live commerce.",
    price: 399000,
    price: "399000.00",
    imageUrl: "https://picsum.photos/seed/sneakers/800/800",
    stock: 18,
  },
  {
    name: "Hoodie Oversize",
    description:
      "Hoodie santai dengan visual yang cocok untuk presentasi produk.",
    price: 289000,
    price: "289000.00",
    imageUrl: "https://picsum.photos/seed/hoodie/800/800",
    stock: 24,
  },
  {
    name: "Tas Kulit",
    description: "Tas premium untuk menampilkan feel eksklusif di layar.",
    price: 759000,
    price: "759000.00",
    imageUrl: "https://picsum.photos/seed/bag/800/800",
    stock: 7,
  },
  {
    name: "Jam Tangan",
    description:
      "Jam tangan minimalis untuk simulasi overlay produk high-value.",
    price: 1299000,
    price: "1299000.00",
    imageUrl: "https://picsum.photos/seed/watch/800/800",
    stock: 12,
  },
  {
    name: "Botol Minum",
    description:
      "Produk tambahan untuk memastikan daftar seed berisi variasi item.",
    price: 89000,
    price: "89000.00",
    imageUrl: "https://picsum.photos/seed/bottle/800/800",
    stock: 40,
  },
];

const seedCommentTemplates = [
  { category: "PRICE", message: "Harganya berapa kak?" },
  { category: "PRICE", message: "Masih promo?" },
  { category: "PRICE", message: "Bisa nego dikit?" },
  { category: "PRICE", message: "Harga final segini ya?" },
  { category: "PRICE", message: "Kalau ambil 2 ada harga khusus?" },
  { category: "HYPE", message: "GAS CHECKOUT 🔥" },
  { category: "HYPE", message: "MURAH BANGET 😭" },
  { category: "HYPE", message: "Auto sold out nih!" },
  { category: "HYPE", message: "Cakep banget barangnya!" },
  { category: "HYPE", message: "Wajib checkout sekarang!" },
  { category: "DISCOUNT", message: "Diskonnya masih aktif?" },
  { category: "DISCOUNT", message: "Wah potongannya lumayan!" },
  { category: "DISCOUNT", message: "Ada voucher tambahan?" },
  { category: "DISCOUNT", message: "Langsung checkout sebelum habis!" },
  { category: "DISCOUNT", message: "Promo begini jarang ada!" },
  { category: "CHECKOUT", message: "Udah masuk cart!" },
  { category: "CHECKOUT", message: "Baru checkout nih." },
  { category: "CHECKOUT", message: "Sikat sekarang!" },
  { category: "CHECKOUT", message: "Checkout 2 pcs sekalian." },
  { category: "CHECKOUT", message: "Pembayaran aman ya?" },
  { category: "STOCK", message: "Stoknya tinggal berapa?" },
  { category: "STOCK", message: "Cepat habis gak ini?" },
  { category: "STOCK", message: "Masih ready warna hitam?" },
  { category: "STOCK", message: "Stock aman sampai kapan?" },
  { category: "STOCK", message: "Jangan sampai kehabisan!" },
  { category: "COD", message: "Bisa COD area saya?" },
  { category: "COD", message: "COD dong kak." },
  { category: "COD", message: "Bayarnya di tempat ya?" },
  { category: "COD", message: "COD aman kan?" },
  { category: "COD", message: "Kalau COD estimasi kapan?" },
];

async function main(): Promise<void> {
  await prisma.product.deleteMany();
  await prisma.commentTemplate.deleteMany();
  await prisma.product.createMany({
    data: seedProducts,
  });
  await prisma.commentTemplate.createMany({
    data: seedCommentTemplates,
  });

  console.log(`Seeded ${seedProducts.length} products.`);
  console.log(`Seeded ${seedCommentTemplates.length} comment templates.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
