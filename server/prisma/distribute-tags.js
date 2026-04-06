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
    console.log('🎯 Distributing course tags across all products...\n');

    try {
        // Get all active products
        const allProducts = await prisma.product.findMany({
            where: {
                isActive: true,
                courseType: { not: null },
            },
        });

        console.log(`📊 Found ${allProducts.length} active courses\n`);

        if (allProducts.length > 0) {
            // First product: bestseller + featured
            await prisma.product.update({
                where: { id: allProducts[0].id },
                data: {
                    courseTags: ['bestseller', 'featured'],
                    isFeatured: true,
                },
            });
            console.log(`✅ ${allProducts[0].name}`);
            console.log(`   Tags: bestseller, featured`);
            console.log(`   Featured: Yes\n`);
        }

        if (allProducts.length > 1) {
            // Second product: trending + featured
            await prisma.product.update({
                where: { id: allProducts[1].id },
                data: {
                    courseTags: ['trending', 'featured'],
                    isFeatured: true,
                },
            });
            console.log(`✅ ${allProducts[1].name}`);
            console.log(`   Tags: trending, featured`);
            console.log(`   Featured: Yes\n`);
        }

        if (allProducts.length > 2) {
            // Third product: new
            await prisma.product.update({
                where: { id: allProducts[2].id },
                data: {
                    courseTags: ['new'],
                    isFeatured: false,
                },
            });
            console.log(`✅ ${allProducts[2].name}`);
            console.log(`   Tags: new`);
            console.log(`   Featured: No\n`);
        }

        // Remaining products: mix of tags
        for (let i = 3; i < allProducts.length; i++) {
            const tags = ['bestseller', 'trending', 'new'][i % 3];
            const isFeatured = i % 2 === 0;

            await prisma.product.update({
                where: { id: allProducts[i].id },
                data: {
                    courseTags: [tags],
                    isFeatured,
                },
            });
            console.log(`✅ ${allProducts[i].name}`);
            console.log(`   Tags: ${tags}`);
            console.log(`   Featured: ${isFeatured ? 'Yes' : 'No'}\n`);
        }

        // Verify the changes
        const bestsellers = await prisma.product.count({
            where: {
                isActive: true,
                courseTags: { has: 'bestseller' },
            },
        });

        const trending = await prisma.product.count({
            where: {
                isActive: true,
                courseTags: { has: 'trending' },
            },
        });

        const newCourses = await prisma.product.count({
            where: {
                isActive: true,
                courseTags: { has: 'new' },
            },
        });

        const featured = await prisma.product.count({
            where: {
                isActive: true,
                isFeatured: true,
            },
        });

        console.log('📈 Summary:');
        console.log(`   Bestsellers: ${bestsellers}`);
        console.log(`   Trending: ${trending}`);
        console.log(`   New: ${newCourses}`);
        console.log(`   Featured: ${featured}`);

        console.log('\n✨ All courses tagged successfully!');
        console.log('🚀 Home page sections should now display properly!');

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
