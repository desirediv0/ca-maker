import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🎯 Adding all tags to all active courses...\n');

    try {
        // Update all active courses to have all tags
        const result = await prisma.product.updateMany({
            where: {
                isActive: true,
                courseType: { not: null },
            },
            data: {
                courseTags: ['bestseller', 'trending', 'new', 'featured'],
                isFeatured: true,
            },
        });

        console.log(`✅ Updated ${result.count} courses with all tags`);
        console.log('   Tags: bestseller, trending, new, featured');
        console.log('   Featured: Yes');

        // Verify
        const courses = await prisma.product.findMany({
            where: {
                isActive: true,
                courseType: { not: null },
            },
            select: { name: true, courseTags: true, isFeatured: true },
        });

        console.log('\n📋 Updated Courses:');
        courses.forEach((c, idx) => {
            console.log(`\n   ${idx + 1}. ${c.name}`);
            console.log(`      Tags: ${c.courseTags.join(', ')}`);
            console.log(`      Featured: ${c.isFeatured}`);
        });

        console.log('\n✨ All sections should now display courses!');

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
