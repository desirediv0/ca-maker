
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing products with missing courseType...');

    try {
        const result = await prisma.product.updateMany({
            where: {
                courseType: null
            },
            data: {
                courseType: 'lecture'
            }
        });

        console.log(`✅ Updated ${result.count} products to have courseType='lecture'`);
    } catch (error) {
        console.error('❌ Error fixing products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
