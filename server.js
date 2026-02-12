const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/contacto', (req, res) => {
    console.log("Mensaje recibido de:", req.body.name);
    res.json({ success: true });
});

app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"));