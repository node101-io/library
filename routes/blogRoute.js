const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');

const detailsGetController = require('../controllers/blog/details/get');

router.get(
  '*',
    generateConstantData,
    detailsGetController
);

module.exports = router;
