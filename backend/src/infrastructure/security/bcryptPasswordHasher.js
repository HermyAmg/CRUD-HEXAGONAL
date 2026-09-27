const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

module.exports = {
  async hash(passwordPlano) {
    return bcrypt.hash(passwordPlano, SALT_ROUNDS);
  },
  async comparar(passwordPlano, hash) {
    return bcrypt.compare(passwordPlano, hash);
  },
};
