const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@/app': 'src/app',
    '@/pages': 'src/pages',
    '@/widgets': 'src/widgets',
    '@/entities': 'src/entities',
    '@/shared/ui': 'src/shared/ui',
    crypto: 'node_modules/crypto-browserify',
    stream: 'node_modules/stream-browserify',
  })(config);

  return config;
};
