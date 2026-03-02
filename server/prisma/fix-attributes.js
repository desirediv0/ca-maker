
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing product attributes...');

    try {
        // 1. Update all products to have default attempts if empty
        const attemptsResult = await prisma.product.updateMany({
            where: {
                OR: [
                    { attempts: { equals: [] } },
                    { attempts: { equals: null } } // Just in case, though it's string[]
                ],
                courseType: { not: null }
            },
            data: {
                attempts: ["May'26", "Sept'26", "Jan'27"]
            }
        });
        console.log(`✅ Updated attempts for ${attemptsResult.count} products`);

        // 2. Update modes
        const modesResult = await prisma.product.updateMany({
            where: {
                OR: [
                    { modes: { equals: [] } },
                    { modes: { equals: null } }
                ],
                courseType: { not: null }
            },
            data: {
                modes: ["online-live", "recorded", "google-drive"]
            }
        });
        console.log(`✅ Updated modes for ${modesResult.count} products`);

        // 3. Update book options
        const booksResult = await prisma.product.updateMany({
            where: {
                OR: [
                    { bookOptions: { equals: [] } },
                    { bookOptions: { equals: null } }
                ],
                courseType: { not: null }
            },
            data: {
                bookOptions: ["with-books", "without-books"]
            }
        });
        console.log(`✅ Updated book options for ${booksResult.count} products`);

        // 4. Update faculty name if missing
        const facultyResult = await prisma.product.updateMany({
            where: {
                facultyName: null,
                courseType: { not: null }
            },
            data: {
                facultyName: "CA Shubham Singhal"
            }
        });
        console.log(`✅ Updated faculty for ${facultyResult.count} products`);

    } catch (error) {
        console.error('❌ Error fixing attributes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
