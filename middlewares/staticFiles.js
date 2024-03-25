const express = require('express');
const path = require('path');

module.exports = function (app) {

    // Middleware para archivos estáticos
    app.use(express.static(path.join(__dirname, '..', 'public')));



};