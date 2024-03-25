const express = require('express');
const app = express();
const sportRoutes = require('./routes/sportsRoutes');
const path = require('path');
const setupStaticFiles = require('./middlewares/staticFiles');


setupStaticFiles(app); // Middleware para archivos estáticos
app.use(express.json()); // Para parsear body de tipo JSON
app.use('/api/sports', sportRoutes); // Rutas para la gestión de deportes
// Middleware para archivos estáticos

app.get('/api/sports', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Si no se proporciona, por defecto es la página 1
    const limit = parseInt(req.query.limit) || 10; // Si no se proporciona, por defecto son 10 registros por página
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const results = {};
  
    if (endIndex < sportsData.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }
  
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }
  
    results.sports = sportsData.slice(startIndex, endIndex); // Asume que `sportsData` es tu arreglo de deportes
    res.json(results);
  });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto http://localhost:${PORT}`));


