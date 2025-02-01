const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const fs = require('fs');
const app = express();
dotenv.config({ path: './config.env' });
require("./db/conn");

app.use(cors());
app.use(express.json());
app.use(require("./router/auth"));
app.use(require("./router/cart"));
const port = process.env.PORT || 8000;

let data;
try {
    const jsonData = fs.readFileSync('data.json', 'utf8');
    data = JSON.parse(jsonData);
} catch (err) {
    console.error('Error parsing JSON:', err);
    app.use((req, res) => res.status(500).json({ message: 'Server Error: Unable to load data.' }));
}

// Keyword search endpoint
app.post('/search', (req, res) => {
    const searchKeyword = req.body.question.toLowerCase();

    // Search for matching keyword
    const result = data.keywords.find(entry =>
        entry.keywords.some(keyword => keyword.toLowerCase() === searchKeyword)
    );

    if (result) {
        res.json({ answer: result.response });
    } else {
        res.json({ answer: "Sorry, I don't understand that." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
