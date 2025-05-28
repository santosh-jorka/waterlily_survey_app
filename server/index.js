import express from "express"
import cors from "cors"
import{ PrismaClient } from  './generated/prisma/index.js'

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /api/questions - fetch all questions
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            orderBy: { displayOrder: 'asc' },
        });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/responses/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid answers format' });
    }

    try {
        // Check if a Response already exists for this user
        const existing = await prisma.response.findUnique({
            where: { id: parseInt(user_id) },
        });

        if (existing) {
            return res.status(400).json({ error: 'Response already exists for this user' });
        }

        // Create Response and linked Answers
        const response = await prisma.response.create({
            data: {
                user: { connect: { id: parseInt(user_id) } },
                answers: {
                    create: answers.map(a => ({
                        value: a.value,
                        question: { connect: { id: a.questionId } },
                    })),
                },
            },
            include: { answers: true },
        });

        res.status(201).json(response);
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/users', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ id: user.id });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});