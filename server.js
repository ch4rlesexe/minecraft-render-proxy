const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/check/:username', async (req, res) => {
    const username = req.params.username.toLowerCase(); 
    try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (response.ok) {
            const data = await response.json();
            res.json({ username: data.name, status: 'Claimed' }); 
        } else if (response.status === 204) {
            res.json({ username, status: 'Unclaimed' });
        } else {
            res.status(response.status).json({ username, status: `Error: ${response.status}` });
        }
    } catch (error) {
        res.status(500).json({ username, status: 'Network Error' });
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
