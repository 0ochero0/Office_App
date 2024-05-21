// server.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/report-issue', async (req, res) => {
    const { officeArea, facility, comments, email } = req.body;
    try {
        const newIssue = await prisma.issue.create({
            data: {
                officeArea,
                facility,
                comments,
                email
            }
        });
        res.status(200).json(newIssue);
    } catch (error) {
        res.status(500).json({ error: 'Error reporting issue' });
    }
});

app.get('/get-reported-issues', async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // past week
                }
            }
        });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching issues' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
