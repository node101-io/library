const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const detailsGetController = require('../controllers/blog/details/get');

router.get(
  '*',
    generateConstantData,
    loadNavbarData,
    detailsGetController
);

module.exports = router;
