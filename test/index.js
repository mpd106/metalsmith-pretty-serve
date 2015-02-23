var assert = require('assert');
var http = require('http');
var metalsmith = require('metalsmith');
var serve = require('..');

var getBodyFromResponse = function(res, fn) {
  var body = '';

  res.on('data', function(buf) {
    body += buf;
  });

  res.on('end', function() {
    assert.equal(res.statusCode, 200);
    fn(body);
  });
};

var getBodyFromRequest = function(opts, fn) {
  var req = http.request(
    opts,
    function(res) {
      getBodyFromResponse(res, fn);
    }).end();
};

describe('metalsmith-pretty-serve', function() {
  var indexBody = "<html>\n  <head>\n  </head>\n  <body>\n    <p>Index</p>\n  </body>\n</html>\n";
  var aboutBody = "<html>\n  <head>\n  </head>\n  <body>\n    <p>About</p>\n  </body>\n</html>\n";
  var resourceBody = "I am a resource.\n";
  var metalsmithInstance;
  var defaultRequestOpts;
  var pluginConfig = {
    port: 1234
  };

  before(function(done) {
    metalsmithInstance = metalsmith('test/fixtures/site')
      .use(serve(pluginConfig))
      .build(function(err) {
        if (err) { throw err; }
        done();
      });

      defaultRequestOpts = {
        host: "localhost",
        port: pluginConfig.port,
        path: "/"
      };
  });

  it('should run on configured port', function(done) {
    var req = http.request(
      defaultRequestOpts,
      function(res) {
        assert.equal(res.statusCode, 200);
        done();
      }).end();
  });

  it('should handle index', function(done) {
    getBodyFromRequest(
      defaultRequestOpts,
      function(body) {
        assert.equal(body, indexBody);
        done();
      });
  });

  it('should handle pretty URLs', function(done) {
    defaultRequestOpts.path = "/about";
    getBodyFromRequest(
      defaultRequestOpts,
      function(body) {
        assert.equal(body, aboutBody);
        done();
      });
  });

  it('should still load files with .html extensions', function(done) {
    defaultRequestOpts.path = "/index.html";
    getBodyFromRequest(
      defaultRequestOpts,
      function(body) {
        assert.equal(body, indexBody);
        done();
      });
  });

  it('should load files without extension', function(done) {
    defaultRequestOpts.path = "/resource";
    getBodyFromRequest(
      defaultRequestOpts,
      function(body) {
        assert.equal(body, resourceBody);
        done();
      });
  });
});
