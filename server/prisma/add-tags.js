import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create a pg Pool instance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
});

async function main() {
    console.log('🏷️ Adding course tags to existing products...\n');

    try {
        // Update all active products to add tags
        const updated1 = await prisma.product.updateMany({
            where: {
                isActive: true,
                courseType: { not: null },
            },
            data: {
                courseTags: ['bestseller', 'featured'],
            },
        });
        console.log(`✅ Updated ${updated1.count} products with bestseller & featured tags`);

        // Add trending tag to some products (update second batch)
        const trendingProducts = await prisma.product.findMany({
            where: {
                isActive: true,
                courseType: { not: null },
            },
            take: 2,
            skip: 1,
        });

        for (const product of trendingProducts) {
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    courseTags: ['trending'],
                },
            });
        }
        console.log(`✅ Updated ${trendingProducts.length} products with trending tag`);

        // Add new tag (just first product)
        const firstProduct = await prisma.product.findFirst({
            where: {
                isActive: true,
                courseType: { not: null },
            },
        });

        if (firstProduct) {
            await prisma.product.update({
                where: { id: firstProduct.id },
                data: {
                    courseTags: ['new', 'bestseller', 'featured'],
                    isFeatured: true,
                },
            });
            console.log(`✅ Updated ${firstProduct.name} with new, bestseller & featured tags and marked as featured`);
        }

        console.log('\n✨ All products tagged successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
