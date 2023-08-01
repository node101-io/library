const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const indexGetController = require('../controllers/projects/index/get');

const filterPostController = require('../controllers/projects/filter/post');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);

router.post(
  '/filter',
    generateConstantData,
    filterPostController
);

module.exports = router;
