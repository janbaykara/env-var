# get-env

Module that exposes a wrapper for _process.env_. You may wonder why, which is
pretty understandable. My primary reasoning for creating this module is to
assist in testing as explained below.


## API
The API is just a single function that's exposed, let's call it _getEnv_.

#### getEnv([varname, [default]])
You can call this function 3 different ways:

1. Calling without arguments will return the _process.env_ Object.
2. Calling with _varname_ will return that variable value or _undefined_.
3. Calling with _varname_, and _default_ will return the value for _varname_
set on process.env, or if the variable is not set _default_ is returned.

## Example

```js
var getEnv = require('get-env');

process.env.SOME_VAR = 'test';

var call1 = getEnv(); // Will return process.env Object
var call2 = getEnv('SOME_VAR'); // Will return "test"
var call3 = getEnv('NOT_SOME_VAR'); // Will return undefined
var call4 = getEnv('NOT_SOME_VAR', 'not-test'); // Will return "not-test"
```


## Good for Testing?

When testing code that relies on environment variables sometimes we need to
mock out/set the environment variables. Having calls to _process.env_ strewn
throughout a test is and can get confusing.

It's better to do something like this:

```js
var env = require('get-env');

exports.concat = function (envVarToGet) {
  return envVarToGet
    .concat(' ')
    .concat(
      env.get(envVarToGet)
    );
};
```

```js
var sinon = require('sinon');
var expect = require('chai').expect;
var proxyquire = require('proxyquire');

describe('module test', function () {

  var envStub;
  var mod;

  beforeEach(function () {
    envStub = sinon.stub();

    mod = proxyquire('./concat', {
      'get-env': envStub
    });
  });

  describe('#concat', function () {
    envStub.returns('WORLD');

    expect(mod.concat('HELLO')).to.equal('HELLO WORLD');

    // Verify a call was actually made to env with the correct arg
    expect(envStub.called).to.be.true;
    expect(envStub.getCall(0).args[0]).to.equal('HELLO');
  });
});
```
