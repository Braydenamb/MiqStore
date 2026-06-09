import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Clear existing data (optional but good for development)
  await prisma.productItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.provider.deleteMany()

  // 2. Create Categories
  const catGames = await prisma.category.create({
    data: {
      name: 'Mobile Games',
      slug: 'mobile-games',
      icon: 'smartphone',
    }
  })

  const catVoucher = await prisma.category.create({
    data: {
      name: 'Voucher Digital',
      slug: 'voucher-digital',
      icon: 'ticket',
    }
  })

  // 3. Create Providers
  const apigames = await prisma.provider.create({
    data: {
      name: 'Apigames',
      slug: 'apigames',
    }
  })

  // 4. Create Products
  const mlbb = await prisma.product.create({
    data: {
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      categoryId: catGames.id,
      publisher: 'Moonton',
      image: '/images/games/mlbb.webp',
      banner: '/images/games/mlbb-banner.webp',
      isPopular: true,
      fields: [
        { name: "userId", label: "User ID", type: "text", required: true },
        { name: "zoneId", label: "Zone ID", type: "text", required: true }
      ]
    }
  })

  const pubgm = await prisma.product.create({
    data: {
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      categoryId: catGames.id,
      publisher: 'Tencent',
      image: '/images/games/pubgm.webp',
      banner: '/images/games/pubgm-banner.webp',
      isPopular: true,
      fields: [
        { name: "userId", label: "Player ID", type: "text", required: true }
      ]
    }
  })

  // 5. Create Product Items (Denominations)
  await prisma.productItem.createMany({
    data: [
      {
        productId: mlbb.id,
        name: '86 Diamonds',
        amount: 86,
        price: 24000,
      },
      {
        productId: mlbb.id,
        name: '172 Diamonds',
        amount: 172,
        price: 48000,
      },
      {
        productId: mlbb.id,
        name: 'Weekly Diamond Pass',
        amount: 1,
        price: 27500,
        isPopular: true,
      },
      {
        productId: pubgm.id,
        name: '60 UC',
        amount: 60,
        price: 15000,
      },
      {
        productId: pubgm.id,
        name: '325 UC',
        amount: 325,
        price: 75000,
      }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
