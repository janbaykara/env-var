'use strict';

var expect = require('chai').expect;

describe('get-env', function () {
  // Some default env vars for tests
  var TEST_VARS = {
    ENV_TEST_STRING: 'oh hai'
  };

  var mod;

  beforeEach(function () {
    delete require.cache[require.resolve('../index.js')];
    mod = require('../index.js');

    // Inject our dummy vars
    Object.keys(TEST_VARS).forEach(function (key) {
      process.env[key] = TEST_VARS[key];
    });
  });


  describe('module.exports', function () {

    it('should return the entire env object', function () {
      var res = mod();

      expect(res).to.be.an('object');
      expect(res.ENV_TEST_STRING).to.be.a('string');
      expect(res.ENV_TEST_STRING).to.equal(TEST_VARS.ENV_TEST_STRING);
    });

    it('should return value in process.env for this', function () {
      expect(mod('ENV_TEST_STRING')).to.be.a('string');
      expect(mod('ENV_TEST_STRING')).to.equal(TEST_VARS.ENV_TEST_STRING);
    });

    it('should return value in process.env and not the default', function () {
      expect(mod('ENV_TEST_STRING', 'NOPE')).to.be.a('string');
      expect(mod('ENV_TEST_STRING', 'NOPE')).to.equal(TEST_VARS.ENV_TEST_STRING);
    });

    it('should return the default specified', function () {
      expect(mod('ENV_TEST_UNDEFINED', 'NOPE')).to.be.a('string');
      expect(mod('ENV_TEST_UNDEFINED', 'NOPE')).to.equal('NOPE');
    });
  });
});
