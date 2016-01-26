var pkg = require('./package.json');
module.exports = require('./bin/' + pkg.library.name + '.js');
