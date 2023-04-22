const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');

const indexGetController = require('../controllers/all/get');

router.get(
  '*',
    generateConstantData,
    indexGetController
);

module.exports = router;
