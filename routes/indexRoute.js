const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadHeaderData = require('../middleware/loadHeaderData');

const blogGetController = require('../controllers/index/blog/get');
const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');
const writerGetController = require('../controllers/index/writer/get');

router.get(
  '/blog/*',
    generateConstantData,
    blogGetController
);
router.get(
  '/',
    generateConstantData,
    indexGetController
);
router.get(
  '/error',
    errorGetController
);
router.get(
  '/writer/*',
    generateConstantData,
    writerGetController
);

module.exports = router;
