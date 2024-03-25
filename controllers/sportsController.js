const fs = require('fs');
const path = require('path');
const sportsFilePath = path.join(__dirname, '../data/sports.json');

const readSportsFile = () => {
    const sportsData = fs.readFileSync(sportsFilePath);
    return JSON.parse(sportsData);
};

const writeSportsFile = (data) => {
    fs.writeFileSync(sportsFilePath, JSON.stringify(data, null, 2));
};

exports.createSport = (req, res) => {
    const { name, price } = req.body;
    const sports = readSportsFile();
    const newSport = { id: sports.length + 1, name, price };
    sports.push(newSport);
    writeSportsFile(sports);
    res.status(201).send(newSport);
};


// Función para obtener todos los deportes
// exports.getAllSports = (req, res) => {
//     const sports = readSportsFile();
//     res.status(200).json(sports);
// };

exports.getAllSports = (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const sports = readSportsFile();

    // Calcular el inicio y final de los deportes que queremos mostrar en la página actual
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Crear una respuesta paginada
    const paginatedSports = sports.slice(startIndex, endIndex);

    res.status(200).json({
        total: sports.length,
        sports: paginatedSports
    });
};


exports.updateSportPrice = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const { price } = req.body;
    const sports = readSportsFile();
    const sportIndex = sports.findIndex(sport => sport.id === parseInt(id));

    if (sportIndex !== -1) {
        sports[sportIndex].price = price;
        sports[sportIndex].name = name;
        writeSportsFile(sports);
        res.status(200).json(sports[sportIndex]);
    } else {
        res.status(404).send({ message: 'Deporte no encontrado' });
    }
};

exports.deleteSport = (req, res) => {
    const { id } = req.params;
    let sports = readSportsFile();
    const sportIndex = sports.findIndex(sport => sport.id === parseInt(id));

    if (sportIndex !== -1) {
        sports = sports.filter(sport => sport.id !== parseInt(id));
        writeSportsFile(sports);
        res.status(200).send({ message: 'Deporte eliminado' });
    } else {
        res.status(404).send({ message: 'Deporte no encontrado' });
    }
};
