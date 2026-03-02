import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting CA Maker seed...\n');

    // Create Categories
    console.log('📁 Creating categories...');
    const caInterAudit = await prisma.category.upsert({
        where: { slug: 'ca-inter-audit' },
        update: {},
        create: {
            name: 'CA Inter Audit',
            slug: 'ca-inter-audit',
            description: 'Comprehensive CA Inter Audit courses with Big 4 expertise',
            isActive: true,
        },
    });

    const caFoundation = await prisma.category.upsert({
        where: { slug: 'ca-foundation' },
        update: {},
        create: {
            name: 'CA Foundation',
            slug: 'ca-foundation',
            description: 'Foundation level courses for CA aspirants',
            isActive: true,
        },
    });

    const caFinal = await prisma.category.upsert({
        where: { slug: 'ca-final' },
        update: {},
        create: {
            name: 'CA Final',
            slug: 'ca-final',
            description: 'Advanced CA Final level courses',
            isActive: true,
        },
    });

    console.log('✅ Categories created\n');

    // Create Attributes
    console.log('🏷️  Creating attributes...');
    const attemptAttr = await prisma.attribute.upsert({
        where: { name: 'Attempt' },
        update: {},
        create: {
            name: 'Attempt',
            inputType: 'multiselect',
        },
    });

    const modeAttr = await prisma.attribute.upsert({
        where: { name: 'Mode' },
        update: {},
        create: {
            name: 'Mode',
            inputType: 'multiselect',
        },
    });

    const bookAttr = await prisma.attribute.upsert({
        where: { name: 'Book Option' },
        update: {},
        create: {
            name: 'Book Option',
            inputType: 'select',
        },
    });

    console.log('✅ Attributes created\n');

    // Create Attribute Values
    console.log('🎯 Creating attribute values...');

    // Attempt values
    const may26 = await prisma.attributeValue.upsert({
        where: { value: "May'26" },
        update: {},
        create: { attributeId: attemptAttr.id, value: "May'26" },
    });

    const nov26 = await prisma.attributeValue.upsert({
        where: { value: "Nov'26" },
        update: {},
        create: { attributeId: attemptAttr.id, value: "Nov'26" },
    });

    // Mode values
    const onlineLive = await prisma.attributeValue.upsert({
        where: { value: 'online-live' },
        update: {},
        create: { attributeId: modeAttr.id, value: 'online-live' },
    });

    const recorded = await prisma.attributeValue.upsert({
        where: { value: 'recorded' },
        update: {},
        create: { attributeId: modeAttr.id, value: 'recorded' },
    });

    // Book values
    const withBook = await prisma.attributeValue.upsert({
        where: { value: 'with-book' },
        update: {},
        create: { attributeId: bookAttr.id, value: 'with-book' },
    });

    const withoutBook = await prisma.attributeValue.upsert({
        where: { value: 'without-book' },
        update: {},
        create: { attributeId: bookAttr.id, value: 'without-book' },
    });

    console.log('✅ Attribute values created\n');

    // Create Courses
    console.log('📚 Creating courses...');

    const regularBatch = await prisma.product.upsert({
        where: { slug: 'ca-inter-audit-regular-batch' },
        update: {},
        create: {
            name: 'CA Inter Audit - Regular Batch',
            slug: 'ca-inter-audit-regular-batch',
            description: 'Complete CA Inter Audit preparation with Big 4 expertise. Includes live classes, structured notes, daily practice, and personal mentoring.',
            shortDescription: 'Complete Audit preparation with Big 4 expertise and daily practice',
            price: 15000,
            discountedPrice: 12000,
            stock: 100,
            isFeatured: true,
            attempts: ["May'26", "Nov'26"],
            modes: ['online-live', 'recorded'],
            bookOptions: ['with-book', 'without-book'],
            tags: ['audit', 'ca-inter', 'big-4', 'live-classes'],
            faculty: 'CA Mohit Kukreja',
            duration: '6 months',
            additionalInfo: `## What You'll Learn

- Complete Standards on Auditing (SA) coverage
- Practical Big 4 audit examples
- Memory techniques for easy retention
- Exam-oriented answer writing
- Latest ICAI amendments

## Course Features

✅ Live interactive classes
✅ Structured revision notes
✅ Daily written practice sessions
✅ Regular mock tests
✅ Personal doubt clearing
✅ One-on-one mentoring sessions

## Who Should Enroll

- CA Inter students preparing for Audit paper
- Students who find Audit complicated
- Those looking for practical, relatable examples
- Students wanting to score high in Audit`,
            sampleNotes: `# Sample: Introduction to Audit

## What is Audit?

Audit is the **independent examination** of financial information to express an opinion on its truth and fairness.

### Key Points to Remember 🎯

1. **Independence** - Auditor must be independent
2. **Examination** - Systematic review of records
3. **Opinion** - Professional judgment on financial statements

### Memory Technique 💡

**I-E-O**: Independent Examination for Opinion

### Exam Tip ⭐

Always mention "true and fair view" in audit opinion questions!

---

*This is just a sample. Full notes include detailed explanations, examples, and practice questions.*`,
            categories: {
                create: {
                    categoryId: caInterAudit.id,
                },
            },
        },
    });

    const fastTrack = await prisma.product.upsert({
        where: { slug: 'ca-inter-audit-fast-track' },
        update: {},
        create: {
            name: 'CA Inter Audit - Fast Track Batch',
            slug: 'ca-inter-audit-fast-track',
            description: 'Intensive fast-track batch for quick revision and exam preparation. Perfect for students with limited time before exams.',
            shortDescription: 'Intensive revision batch for quick exam preparation',
            price: 8000,
            discountedPrice: 6500,
            stock: 100,
            isFeatured: true,
            attempts: ["May'26"],
            modes: ['online-live'],
            bookOptions: ['without-book'],
            tags: ['audit', 'ca-inter', 'fast-track', 'revision'],
            faculty: 'CA Mohit Kukreja',
            duration: '2 months',
            additionalInfo: `## Fast Track Features

⚡ **Quick Coverage** - Complete syllabus in 2 months
⚡ **Focused Revision** - Only exam-important topics
⚡ **Daily Practice** - Intensive answer writing
⚡ **Mock Tests** - Weekly exam simulation

## Ideal For

- Students with limited preparation time
- Those who need quick revision
- Students appearing in upcoming attempt
- Quick learners who prefer intensive batches`,
            sampleNotes: `# Fast Track Revision Notes

## Quick Revision Checklist ✅

### Week 1-2: Standards on Auditing
- SA 200-299: General Principles
- SA 300-499: Risk Assessment
- SA 500-599: Audit Evidence

### Week 3-4: Practical Applications
- Audit Planning
- Internal Controls
- Substantive Procedures

### Week 5-8: Practice & Tests
- Daily answer writing
- Mock tests
- Doubt clearing

---

*Fast track notes are concise and exam-focused!*`,
            categories: {
                create: {
                    categoryId: caInterAudit.id,
                },
            },
        },
    });

    const dailyPractice = await prisma.product.upsert({
        where: { slug: 'ca-inter-audit-daily-practice' },
        update: {},
        create: {
            name: 'CA Inter Audit - Daily Written Practice',
            slug: 'ca-inter-audit-daily-practice',
            description: 'Dedicated daily written practice sessions to improve answer writing skills and exam presentation.',
            shortDescription: 'Daily answer writing practice with expert evaluation',
            price: 5000,
            discountedPrice: 4000,
            stock: 100,
            isFeatured: false,
            attempts: ["May'26", "Nov'26"],
            modes: ['online-live'],
            bookOptions: ['without-book'],
            tags: ['audit', 'practice', 'answer-writing'],
            faculty: 'CA Mohit Kukreja',
            duration: '3 months',
            additionalInfo: `## Practice Sessions Include

📝 **Daily Questions** - Topic-wise practice questions
📝 **Answer Evaluation** - Detailed feedback on answers
📝 **Presentation Tips** - How to present answers in exam
📝 **Time Management** - Speed and accuracy training

## Benefits

- Improve answer writing speed
- Learn proper presentation
- Get personalized feedback
- Build exam confidence`,
            sampleNotes: `# Daily Practice - Sample Question

## Question: Explain the concept of Audit Risk

### Model Answer Structure:

**Introduction** (2 marks)
- Define audit risk
- Mention components

**Body** (6 marks)
- Inherent Risk
- Control Risk  
- Detection Risk
- Relationship between components

**Conclusion** (2 marks)
- Importance in audit planning
- Practical application

### Presentation Tips:
✅ Use headings and subheadings
✅ Underline key terms
✅ Use bullet points for clarity
✅ Write legibly

---

*Practice makes perfect! Join for daily questions and evaluation.*`,
            categories: {
                create: {
                    categoryId: caInterAudit.id,
                },
            },
        },
    });

    console.log('✅ Courses created\n');

    // Create Sample Reviews
    console.log('⭐ Creating sample reviews...');

    await prisma.review.createMany({
        data: [
            {
                productId: regularBatch.id,
                userId: 'sample-user-1',
                rating: 5,
                comment: 'Amazing teaching! CA Mohit sir makes Audit so simple with real Big 4 examples. The daily practice sessions really helped me improve my answer writing. Highly recommended! 🌟',
                isVerified: true,
            },
            {
                productId: regularBatch.id,
                userId: 'sample-user-2',
                rating: 5,
                comment: 'Best Audit faculty I have come across. The structured notes are perfect for revision and the memory techniques actually work! Got 72 marks in my attempt 🎉',
                isVerified: true,
            },
            {
                productId: regularBatch.id,
                userId: 'sample-user-3',
                rating: 4,
                comment: 'Very good course. The practical examples from Big 4 audit experience make concepts crystal clear. Personal mentoring sessions are very helpful.',
                isVerified: true,
            },
            {
                productId: fastTrack.id,
                userId: 'sample-user-4',
                rating: 5,
                comment: 'Perfect for quick revision! Covered entire syllabus in 2 months with focused approach. The mock tests were exactly like the real exam 💯',
                isVerified: true,
            },
            {
                productId: fastTrack.id,
                userId: 'sample-user-5',
                rating: 5,
                comment: 'Fast track batch is worth every penny. Intensive but very effective. Cleared Audit in first attempt with good marks!',
                isVerified: true,
            },
            {
                productId: fastTrack.id,
                userId: 'sample-user-6',
                rating: 4,
                comment: 'Great for last minute preparation. Sir covers all important topics efficiently. Would recommend for students with time constraints.',
                isVerified: true,
            },
            {
                productId: dailyPractice.id,
                userId: 'sample-user-7',
                rating: 5,
                comment: 'Daily practice sessions transformed my answer writing! The personalized feedback helped me understand where I was going wrong. Must join! ✍️',
                isVerified: true,
            },
            {
                productId: dailyPractice.id,
                userId: 'sample-user-8',
                rating: 5,
                comment: 'Excellent for improving presentation and speed. The evaluation is very detailed and helps you improve continuously.',
                isVerified: true,
            },
            {
                productId: dailyPractice.id,
                userId: 'sample-user-9',
                rating: 4,
                comment: 'Very helpful for building exam confidence. Regular practice with feedback makes a huge difference in actual exam.',
                isVerified: true,
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Reviews created\n');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
