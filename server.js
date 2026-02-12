const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/contacto', (req, res) => {
    console.log("Mensaje recibido de:", req.body.name);
    res.json({ success: true });
});

module.exports = app;