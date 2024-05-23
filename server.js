// server.js
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the main page using EJS
app.get('/', (req, res) => {
    const currentDate = moment().tz('Asia/Singapore').format('MMM YY, ddd, hA');
    const message = 'Hello, this is a test message from server.js'; // Define the message variable
    res.render('index', { currentDate, message }); // Pass the message and current date to the template
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
