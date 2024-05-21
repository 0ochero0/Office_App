const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

app.post('/report-issue', async (req, res) => {
    const { officeArea, facility, comments, email } = req.body;
    console.log('Received data:', { officeArea, facility, comments, email });
    try {
        const issue = await prisma.issue.create({
            data: { officeArea, facility, comments, email },
        });
        console.log('Issue saved:', issue);
        res.status(200).json(issue);
    } catch (err) {
        console.error('Error saving issue:', err);
        res.status(500).send('Server error');
    }
});

app.get('/get-reported-issues', async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
        });
        console.log('Issues retrieved:', issues);
        res.status(200).json(issues);
    } catch (err) {
        console.error('Error retrieving issues:', err);
        res.status(500).send('Server error');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
