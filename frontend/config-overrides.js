const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    components: 'src/components',
    pages: 'src/pages',
    stores: 'src/stores',
    crypto: 'node_modules/crypto-browserify',
    stream: 'node_modules/stream-browserify',
  })(config);

  return config;
};
