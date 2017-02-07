/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/files              ->  create
 * GET     /api/files/:id          ->  show
 * DELETE  /api/files/:id          ->  destroy
 */

'use strict';

import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

const controllers = {
  create: (req, res) => {
    console.log(req);
    return res.status(201).json({
      url: `/api/files/${req.file.filename}`,
      filename: req.file.filename,
    });
  },

  show: (req, res) => {
    const filename = req.params.id;
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);

    // get metadata
    gfs.findOne({ filename }, (err, file) => {
      if(err) return res.status(500).send(err);
      if(!file) return res.status(404).send('File not found.');

      res.setHeader('Content-Type', file.contentType);
      const readStream = gfs.createReadStream({ filename });
      readStream.on('open', () => readStream.pipe(res));
      // This catches any errors that happen while creating the readable stream (usually invalid names)
      readStream.on('error', function(err) {
        return res.status(404).send(err);
      });
    });
  },
  destroy: (req, res) => {
    const filename = req.params.id;
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);

    gfs.exist({ filename }, (err, found) => {
      if(err) return res.status(500).send(err);
      if(found) {
        gfs.remove({ filename }, err => {
          if(err) return res.status(500).send(err);
          return res.status(204).send({ status: 'success' });
        });
      } else {
        return res.status(404).send({ status: 'not found' });
      }
    });


  },
};

exports = module.exports = controllers;
