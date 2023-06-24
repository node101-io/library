const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const editorsPickGetController = require('../controllers/index/editors-pick/get');
const errorGetController = require('../controllers/index/error/get');
const exclusiveGetController = require('../controllers/index/exclusive/get');
const indexGetController = require('../controllers/index/index/get');
const searchGetController = require('../controllers/index/search/get');
const stableGetController = require('../controllers/index/stable/get');

const filterPostController = require('../controllers/index/filter/post');
const themePostController = require('../controllers/index/theme/post');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);
router.get(
  '/editors-pick',
    generateConstantData,
    loadNavbarData,
    editorsPickGetController
);
router.get(
  '/error',
    errorGetController
);
router.get(
  '/exclusive',
    generateConstantData,
    loadNavbarData,
    exclusiveGetController
);
router.get(
  '/search',
    generateConstantData,
    loadNavbarData,
    searchGetController
);
router.get(
  '/stable/*',
    generateConstantData,
    stableGetController
);

router.post(
  '/filter',
    generateConstantData,
    filterPostController
);
router.post(
  '/theme',
    generateConstantData,
    themePostController
);

module.exports = router;
