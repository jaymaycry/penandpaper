'use strict';

var express = require('express');
var controller = require('./file.controller');

import multer from 'multer';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import GridFsStorage from 'multer-gridfs-storage';

const gfs = Grid(mongoose.connection.db, mongoose.mongo);

const storage = GridFsStorage({ gfs });
const upload = multer({ storage });

var router = express.Router();

router.get('/:id', controller.show);
router.post('/', upload.single('file'), controller.create);
router.delete('/:id', controller.destroy);

module.exports = router;
