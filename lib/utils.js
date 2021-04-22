const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SALT_ROUND, SECRET_KEY } = process.env;

const hashPassword = async (password) =>
  await bcrypt.hash(password, Number(SALT_ROUND));

const createToken = async (payload) =>
  await jwt.sign(payload, SECRET_KEY, { expiresIn: "1800s" });

module.exports = {
  hashPassword,
  createToken,
};
