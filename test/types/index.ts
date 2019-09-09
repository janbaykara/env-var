
import * as env from '../../';
import * as assert from 'assert';
import * as url from 'url';

function test () {
  // BASE 64
  process.env.BASE64 = 'aGVsbG8='
  assert.equal(
    env.get('BASE64').required().convertFromBase64().asString(),
    'hello'
  )

  // STRINGS
  process.env.STRING = 'string'
  assert.equal(env.get('STRING').required().asString(), process.env.STRING)
  assert.equal(env.get('SOME_STRING').asString(), undefined)


  // INTEGERS
  process.env.INT = '0'
  process.env.INT_POSITIVE = '2'
  process.env.INT_NEGATIVE = '-2'

  const intVal = env.get('INT').required().asInt();
  const intValPositive = env.get('INT_POSITIVE').asIntPositive();
  const intValNegative = env.get('INT_NEGATIVE').asIntNegative();

  assert.equal(intVal, 0)
  assert.equal(intValPositive, 2)
  assert.equal(intValNegative, -2)


  // FLOATs
  process.env.FLOAT = '13.234234'
  process.env.FLOAT_POSITIVE = '13.234234'
  process.env.FLOAT_NEGATIVE = '-13.234234'

  const floatVal = env.get('FLOAT').required().asFloat();
  const floatValPositive = env.get('FLOAT_POSITIVE').asFloatPositive();
  const floatValNegative = env.get('FLOAT_NEGATIVE').asFloatNegative();

  assert.equal(floatVal, 13.234234)
  assert.equal(floatValPositive, 13.234234)
  assert.equal(floatValNegative, -13.234234)


  // BOOLEAN
  process.env.BOOL = '0'
  process.env.BOOL_STRICT = 'true'

  const asBool = env.get('BOOL').required().asBool();
  const asBoolStrict = env.get('BOOL_STRICT').asBoolStrict();

  assert.equal(asBool, false)
  assert.equal(asBoolStrict, true)


  // ARRAY
  process.env.ARRAY_COMMA = '1,2,3'
  process.env.ARRAY_HYPHEN = '1-2-3'

  assert.deepEqual(env.get('ARRAY_COMMA').asArray(), ['1', '2', '3'])
  assert.deepEqual(env.get('ARRAY_HYPHEN').asArray('-'), ['1', '2', '3'])


  // JSON
  process.env.JSON_OBJECT = JSON.stringify({ test: 'testing' })
  process.env.JSON_ARRAY = JSON.stringify([1,2,3])

  assert.deepEqual(env.get('JSON_OBJECT').asJson(), { test: 'testing' })
  assert.deepEqual(env.get('JSON_OBJECT').asJsonObject(), { test: 'testing' })
  assert.deepEqual(env.get('JSON_ARRAY').asJsonArray(), [1,2,3])


  // URLS
  process.env.URL_STRING = 'http://google.com/'

  assert.deepEqual(env.get('URL_STRING').asUrlObject(), new URL(process.env.URL_STRING))
  assert.equal(env.get('URL_STRING').asUrlString(), 'http://google.com/')

  // FROM
  const newEnv = env.from(process.env)
  assert.equal(newEnv.get('STRING').required().asString(), process.env.STRING)
  assert.equal(newEnv.get('SOME_STRING').asString(), undefined)

  // FROM WITH EXTENSIONS
  interface EmailParts {
    username: string
    domain: string
  }

  const asEmailComponents: env.ExtensionFn<EmailParts> = (value) => {
    const parts = value.split('@')

    if (parts.length != 2) {
      throw new env.EnvVarError('probably not an email')
    } else {
      return {
        username: parts[0],
        domain: parts[1]
      }
    }
  }

  const extrasEnv = env.from({
    EMAIL: 'hello@example.com'
  }, {
    asEmailComponents
  })

  assert.equal(
    extrasEnv.get('MISSING_EMAIL').asEmailComponents(),
    undefined
  )
  assert.deepEqual(
    extrasEnv.get('EMAIL').asEmailComponents(),
    {
      domain: 'example.com',
      username: 'hello'
    }
  )
}

test()
