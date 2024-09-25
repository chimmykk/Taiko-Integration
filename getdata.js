const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const baseUrl = 'https://trailblazer.mainnet.taiko.xyz/s2/v2/leaderboard/user';

app.use(express.json());

app.get('/fetchdata', async (req, res) => {
    const size = 150000; 
    const maxPages = 10; 
    let pageRequests = [];

    try {
        for (let page = 0; page < maxPages; page++) {
            const url = `${baseUrl}?page=${page}&size=${size}&first=0&last=1`;
            pageRequests.push(
                axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'Accept-Encoding': 'gzip, deflate, br, zstd',
                        'Accept-Language': 'en-US,en-IN;q=0.9,en;q=0.8',
                        'Cache-Control': 'max-age=0',
                        'Priority': 'u=0, i',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'none',
                        'Sec-Fetch-User': '?1',
                        'Upgrade-Insecure-Requests': '1'
                    }
                })
            );
        }

        const responses = await Promise.all(pageRequests); 
        const allData = responses.flatMap(response => response.data.data); 

        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        const jsonFilePath = path.join(dataDir, 'points.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(allData, null, 2));

        res.json(allData); 
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/getpoints', (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    const jsonFilePath = path.join(__dirname, 'data', 'points.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading data file' });
        }

        try {
            const pointsData = JSON.parse(data);
            let foundScore = null;

            // Traverse through the data and look inside the 'items' array
            for (const entry of pointsData) {
                for (const item of entry.items) {
                    if (item.address && item.address.toLowerCase() === address.toLowerCase()) {
                        foundScore = item.totalScore;
                        break;
                    }
                }
                if (foundScore !== null) break; // Stop searching if found
            }

            if (foundScore !== null) {
                res.json({ address, totalScore: foundScore });
            } else {
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ error: 'Error processing data' });
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
