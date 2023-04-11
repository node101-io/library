const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');

const indexGetController = require('../controllers/writers/index/get');
const detailsGetController = require('../controllers/writers/details/get');

router.get(
  '/',
    generateConstantData,
    indexGetController
);
router.get(
  '/*',
    generateConstantData,
    detailsGetController
);

module.exports = router;
