'use strict';

module.exports = function (vname, def) {
  if (typeof vname === 'string') {
    return (process.env[vname] !== undefined) ? process.env[vname] : def;
  } else {
    return process.env;
  }
};
