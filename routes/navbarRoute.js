const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');

const editorsPickGetController = require('../controllers/navbar/editors-pick/get');
const exclusiveGetController = require('../controllers/navbar/exclusive/get');
const tagsGetController = require('../controllers/navbar/tags/get');

router.get(
  '/editors-pick',
    generateConstantData,
    editorsPickGetController
);
router.get(
  '/exclusive',
    generateConstantData,
    exclusiveGetController
);
router.get(
  '/tags',
    generateConstantData,
    tagsGetController
);

module.exports = router;
