const express = require('express');
const app = express();
const sportRoutes = require('./routes/sportsRoutes');
const path = require('path');
const setupStaticFiles = require('./middlewares/staticFiles');


setupStaticFiles(app); // Middleware para archivos estáticos
app.use(express.json()); // Para parsear body de tipo JSON
app.use('/api/sports', sportRoutes); // Rutas para la gestión de deportes
// Middleware para archivos estáticos



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto http://localhost:${PORT}`));


