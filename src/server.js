const path = require('path');
const express = require('express');
const router = require('./lib/routes/router');
const {PORT = 3001} = process.env;
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());



// Serve API requests from the router
app.use('/api', router);

// Serve app production bundle
app.use(express.static('dist/app'));

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
