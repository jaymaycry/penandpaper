'use strict';

var express = require('express');
var controller = require('./file.controller');
import * as auth from '../../auth/auth.service';

import multer from 'multer';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import GridFsStorage from 'multer-gridfs-storage';

const gfs = Grid(mongoose.connection.db, mongoose.mongo);

const storage = GridFsStorage({ gfs });
const upload = multer({ storage });

var router = express.Router();

router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), upload.single('file'), controller.create);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
