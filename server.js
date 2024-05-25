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
    res.render('index', {currentDate}); // Pass the current date to the template
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

app.get('/issues-summary', async (req, res) => {
    try {
      // Calculate the date 3 days ago from now
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
      // Fetch issues from the database created in the past 3 days and group by office area and facility
      const issuesSummary = await prisma.issue.groupBy({
        by: ['officeArea', 'facility'],
        where: {
          createdAt: {
            gte: threeDaysAgo // Filter issues created within the last 3 days
          }
        },
        _count: {
          id: true // Count the number of reports for each combination of office area and facility
        }
      });
  
      // Log the fetched summary for troubleshooting
      console.log('Fetched issues summary:', issuesSummary);
  
      // Render the issues-summary.ejs view and pass the summary data
      res.render('issues-summary', { issuesSummary });
    } catch (error) {
      console.error('Error fetching issues summary:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  


app.get('/get-reported-issues', async (req, res) => {
    try {
        const issues = await prisma.issue.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // one day
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
