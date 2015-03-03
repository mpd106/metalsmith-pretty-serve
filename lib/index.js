var express = require('express');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

// TODO: List the port in the output
var applyDefaults = function(options) {
  var result = {};
  result.port = typeof options != 'undefined' && options.port ? options.port : 3001;
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
    // if the server exists, bail out--don't want to recreate
    if (server) {
      done();
      return;
    }

    server = createServer(metalsmith.destination());
    console.log(chalk.green('Url-prettifying server started on port: ' + completeOptions.port));
    server.listen(completeOptions.port);

    done();
  };
  
  return plugin;
};
