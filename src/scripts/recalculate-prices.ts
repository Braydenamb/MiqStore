import { prisma } from "../lib/prisma";
import { calculateSellingPrice } from "../lib/catalog-rules";

async function main() {
  console.log("Recalculating prices for all items using Auto Margin Engine...");
  
  const items = await prisma.productItem.findMany({
    where: {
      originalPrice: { not: null }
    }
  });

  console.log(`Found ${items.length} items with originalPrice to recalculate.`);

  let updatedCount = 0;
  for (const item of items) {
    if (item.originalPrice !== null) {
      const newPrice = calculateSellingPrice(item.originalPrice);
      if (item.price !== newPrice) {
        await prisma.productItem.update({
          where: { id: item.id },
          data: { price: newPrice }
        });
        updatedCount++;
        console.log(`Item ${item.name} (${item.id}): Updated price from ${item.price} to ${newPrice}`);
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} items.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
