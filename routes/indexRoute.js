const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');

const filterPostController = require('../controllers/index/filter/post');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);
router.get(
  '/error',
    errorGetController
);

router.post(
  '/filter',
    generateConstantData,
    filterPostController
);

module.exports = router;
