const express = require('express');
const tags = require('../controllers/tags');

const router = express.Router();

router.get('/', tags.getAllTags);

router.get('/:tagname', tags.getOneTags);


module.exports = router;