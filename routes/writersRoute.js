const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const indexGetController = require('../controllers/writers/index/get');
const detailsGetController = require('../controllers/writers/details/get');

const filterPostController = require('../controllers/writers/filter/post');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);
router.get(
  '/*',
    generateConstantData,
    loadNavbarData,
    detailsGetController
);

router.post(
  '/filter',
    generateConstantData,
    filterPostController
);

module.exports = router;
