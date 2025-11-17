const express = require('express');
const router = express.Router();

const {clienteRoutes} = require('./clienteRoutes');

router.use("/", clienteRoutes);

module.exports = { router };