import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
    // Seed Users
    const users = [
        { id: 1, email: "demo@example.com",firstName: "Demo", lastName: "User",updatedAt: new Date(), createdAt: new Date() },
        { id: 2, email: "jane.doe@example.com",firstName: "Jane", lastName: "Doe",updatedAt: new Date(), createdAt: new Date() },
        { id: 3, email: "john.doe@example.com",firstName: "John", lastName: "Doe",updatedAt: new Date(), createdAt: new Date() }
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user,
        });
    }

    // Seed Questions
    const questions = [
        {
            id: 1,
            questionText: "What is your age?",
            questionType: "number",
            displayOrder: 1,
            updatedAt: new Date()
        },
        {
            id: 2,
            questionText: "What is your gender?",
            questionType: "multiple-choice",
            displayOrder: 2,
            updatedAt: new Date()
        },
        {
            id: 3,
            questionText: "What is your marital status?",
            questionType: "multiple-choice",
            displayOrder: 3,
            updatedAt: new Date()
        },
        {
            id: 4,
            questionText: "Do you have any chronic health conditions?",
            questionType: "checkbox",
            displayOrder: 4,
            updatedAt: new Date()
        },
        {
            id: 5,
            questionText: "How would you rate your overall health?",
            questionType: "rating",
            displayOrder: 5,
            updatedAt: new Date()
        },
        {
            id: 6,
            questionText: "What is your estimated annual household income?",
            questionType: "number",
            displayOrder: 6,
            updatedAt: new Date()
        },
        {
            id: 7,
            questionText: "Do you currently have any long-term care insurance?",
            questionType: "yes-no",
            displayOrder: 7,
            updatedAt: new Date()
        },
    ];

    for (const q of questions) {
        await prisma.question.upsert({
            where: { id: q.id },
            update: {},
            create: q,
        });
    }

    console.log("🌱 Seed data inserted successfully.");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
