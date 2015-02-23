var express = require('express');
var path = require('path');
var fs = require('fs');

// TODO: List the port in the output
var applyDefaults = function(options) {
  var result = {};
  result.port = options.port ? options.port : 3001;
  return result;
};

var fileHasExtension = function(path) {
  return path.indexOf('.') !== -1;
};

var createPrettyUriMiddleware = function(source) {
  return function(req, res, next) {
    if (!fileHasExtension(req.path)) {
      var rawLocalFilePath = path.join(source, req.path);
      fs.exists(rawLocalFilePath, function(exists) {
        if (exists) {
          next();
        } else {
          var localFilePathWithExtension = rawLocalFilePath + '.html';
          fs.exists(localFilePathWithExtension, function(exists) {
            if (exists) {
              req.url += '.html';
            }
            next();
          });
        }
      });
    } else {
      next();
    }
  };
};

var createServer = function(source) {
  var app = express();
  app.use(createPrettyUriMiddleware(source));
  app.use(express.static(source));

  return app;
};

module.exports = function(options) {
  var server;

  var completeOptions = applyDefaults(options);

  var plugin = function(files, metalsmith, done) {
    console.log('Using serve');
    // if the server exists, bail out--don't want to recreate
    if (server) {
      console.log('Server already exists--exiting');
      done();
      return;
    }

    // create the server
    console.log('Creating server');
    server = createServer(metalsmith.destination());

    // start listenin'
    console.log('Listening');
    server.listen(completeOptions.port);

    done();
  };
  
  return plugin;
};
