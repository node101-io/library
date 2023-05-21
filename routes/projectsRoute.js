const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const indexGetController = require('../controllers/projects/index/get');
const detailsGetController = require('../controllers/projects/details/get');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);
router.get(
  '/*',
    generateConstantData,
    detailsGetController
);

module.exports = router;
